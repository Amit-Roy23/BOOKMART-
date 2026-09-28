import { Button } from "@/components/ui/Button";
import HeartBurst from "@/components/ui/HeartBrust";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useNavigation, useRoute } from "expo-router";
import React, { useCallback, useMemo, useState, useEffect, memo } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/clients";
import { BookCardSkeleton } from "@/components/skeleton/SkeletonLoader";

const { width, height } = Dimensions.get("window");
const COLUMN_GAP = SPACING.md;
const PADDING_HORIZONTAL = SPACING.lg;
const CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - COLUMN_GAP) / 2;

const MOCK_USER_LOCATION = { latitude: 22.8943, longitude: 88.4239 };
const DISTANCE_FILTERS = ["Nearest To You", "< 2 km", "< 5 km", "< 10 km"];

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const NearestBooksScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCategoryId = route?.params?.categoryId || "all";

  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);
  const [activeFilter, setActiveFilter] = useState("Nearest To You");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request user coordinates
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          setUserLocation(MOCK_USER_LOCATION);
          return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setUserLocation(MOCK_USER_LOCATION);
          return;
        }
        let location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }
        if (location && location.coords) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          setUserLocation(MOCK_USER_LOCATION);
        }
      } catch (err) {
        setUserLocation(MOCK_USER_LOCATION);
      }
    };
    requestLocation();
  }, []);

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/v1/core/profile/me/");
      return response.data;
    },
  });

  // Fetch real listings
  const { data: listingsData, isLoading: isLoadingListings, refetch } = useQuery({
    queryKey: ["all-listings"],
    queryFn: async () => {
      const response = await api.get("/api/v1/marketplace/listings/");
      return response.data;
    },
  });

  // Fetch categories (genres) for filter modal
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.get("/api/v1/book/genres/");
      return response.data;
    },
  });

  const FIXED_CATEGORIES = useMemo(
    () => [
      { id: "all", name: "All Categories", slug: "all" },
      { id: "fiction", name: "Fiction", slug: "fiction" },
      { id: "academic", name: "Academic", slug: "academic" },
      { id: "self-help", name: "Self Help", slug: "self-help" },
      { id: "biography", name: "Biography", slug: "biography" },
      { id: "business", name: "Business", slug: "business" },
      { id: "literature", name: "Literature", slug: "literature" },
      { id: "comics", name: "Comics", slug: "comics" },
      { id: "others", name: "Others", slug: "others" },
    ],
    []
  );

  const categories = FIXED_CATEGORIES;

  // Compute and sort listings
  const processedBooks = useMemo(() => {
    if (!listingsData) return [];
    const rawListings = Array.isArray(listingsData) ? listingsData : listingsData?.results || [];
    if (rawListings.length === 0) return [];

    // 1. Map backend listings and calculate distance
    let books = rawListings.map((item: any, index: number) => {
      let distanceKm = 99999;
      if (userLocation && item.latitude && item.longitude) {
        distanceKm = getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          Number(item.latitude),
          Number(item.longitude)
        );
      } else {
        // approximate small distance for items without GPS coords
        distanceKm = 0.5 + (index % 5) * 0.4;
      }

      const firstGenre = item.book?.genres?.[0] || item.genre || "General";
      const genreName = typeof firstGenre === "string" ? firstGenre : firstGenre?.name || "General";
      const genreSlug = typeof firstGenre === "string"
        ? firstGenre.toLowerCase().replace(/\s+/g, "-")
        : firstGenre?.slug || genreName.toLowerCase().replace(/\s+/g, "-");

      const authorsList =
        item.book?.authors?.map((a: any) => (typeof a === "string" ? a : a.name)).join(", ") ||
        "Unknown Author";

      return {
        id: String(item.id),
        title: item.book?.title || item.title || "Untitled Book",
        author: authorsList,
        price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
        imageUri:
          item.listing_images?.[0]?.image_url ||
          item.book?.cover_url ||
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop",
        condition: item.condition || "GOOD",
        distanceKm,
        discount: "20% off",
        genre: genreName,
        genreSlug,
      };
    });

    // 2. Sort by distance nearest first
    books.sort((a: any, b: any) => a.distanceKm - b.distanceKm);

    // 3. Filter by category (genre)
    if (activeCategoryId && activeCategoryId !== "all") {
      const selectedCategory = categories.find(
        (c) => String(c.id) === String(activeCategoryId) || c.slug === activeCategoryId
      );
      if (selectedCategory) {
        const catSlug = (selectedCategory.slug || selectedCategory.name || "").toLowerCase().replace(/\s+/g, "-");
        books = books.filter((b: any) => {
          const bSlug = (b.genreSlug || b.genre || "").toLowerCase().replace(/\s+/g, "-");
          if (catSlug === "others") {
            const known = ["fiction", "academic", "self-help", "biography", "business", "literature", "comics"];
            return !known.some((k) => bSlug.includes(k));
          }
          return bSlug.includes(catSlug) || catSlug.includes(bSlug);
        });
      }
    }

    // 4. Filter by distance range chip
    if (activeFilter !== "Nearest To You") {
      const maxDist = activeFilter.includes("2") ? 2 : activeFilter.includes("5") ? 5 : 10;
      books = books.filter((b: any) => b.distanceKm <= maxDist);
    }

    // 5. Filter by price range
    books = books.filter((b: any) => b.price <= priceRange);

    // 6. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      books = books.filter((book: any) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q)
      );
    }

    return books;
  }, [listingsData, userLocation, activeCategoryId, activeFilter, searchQuery, priceRange, categories]);

  const handleBookPress = useCallback((book: any) => {
    router.push({
      pathname: "/(screens)/BookDetails",
      params: { listingId: book.id, categoryTitle: "Nearest" },
    });
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="arrow-back" size={28} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity onPress={() => setShowFilter(true)}>
        <Ionicons name="options-outline" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersWrapper}>
      <TouchableOpacity
        style={styles.inlineMapButton}
        onPress={() =>
          router.push({
            pathname: "/(screens)/NearestBooksMap",
            params: { categoryId: activeCategoryId },
          })
        }
      >
        <Ionicons name="map" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DISTANCE_FILTERS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => {
          const isActive = activeFilter === item;
          return (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
            >
              <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const BookCardItem = memo(({ item, onPress }: { item: any; onPress: (item: any) => void }) => {
    const queryClient = useQueryClient();
    const [showBurst, setShowBurst] = useState(false);

    const { data: wishlistData } = useQuery({
      queryKey: ["wishlist"],
      queryFn: async () => {
        const response = await api.get("/api/v1/marketplace/wishlist/");
        return response.data.results || [];
      },
    });

    const wishlistEntry = useMemo(() => {
      if (!wishlistData) return null;
      return wishlistData.find((w: any) => String(w.listing.id) === String(item.id));
    }, [wishlistData, item.id]);

    const isLiked = !!wishlistEntry;

    const toggleWishlistMutation = useMutation({
      mutationFn: async () => {
        if (isLiked && wishlistEntry) {
          await api.delete(`/api/v1/marketplace/wishlist/${wishlistEntry.id}/`);
        } else {
          await api.post("/api/v1/marketplace/wishlist/", { listing: item.id });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      },
    });

    const toggleLike = useCallback(() => {
      if (!isLiked) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 600);
      } else {
        Haptics.selectionAsync();
      }
      toggleWishlistMutation.mutate();
    }, [isLiked, toggleWishlistMutation]);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          Haptics.selectionAsync();
          onPress(item);
        }}
        activeOpacity={0.9}
      >
        <View style={styles.cardInner}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.bookCover}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.discountText}>
              {item.distanceKm < 99999 ? `${item.distanceKm.toFixed(1)} km` : "Nearby"}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>₹ </Text>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
        </View>

        {/* Floating Wishlist Button */}
        <TouchableOpacity
          style={styles.fab}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={toggleLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? COLORS.white : COLORS.white}
          />
          {showBurst && (
            <View style={{ position: "absolute", top: 5, left: 5 }}>
              <HeartBurst />
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  const renderBookCard = useCallback(
    ({ item }: { item: any }) => <BookCardItem item={item} onPress={handleBookPress} />,
    [handleBookPress]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      {renderFilters()}

      {isLoadingListings ? (
        <View style={{ paddingHorizontal: SPACING.lg }}>
          <FlatList
            data={Array.from({ length: 6 })}
            keyExtractor={(_, index) => String(index)}
            renderItem={() => <BookCardSkeleton />}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FlatList
          data={processedBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBookCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onRefresh={refetch}
          refreshing={isLoadingListings}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 }}>
              <Text style={{ fontFamily: FONTS.manrope.medium, color: COLORS.textMuted }}>No nearest books found.</Text>
            </View>
          }
        />
      )}

      {showFilter && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(250)} style={[styles.overlay]}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setShowFilter(false)} />

          <Animated.View
            entering={ZoomIn.duration(250).springify()}
            exiting={ZoomOut.duration(200)}
            style={styles.filterModal}
          >
            <View style={{ padding: 20, minHeight: 200 }}>
              <View style={styles.filterHeader}>
                <Ionicons name="close-outline" size={28} color={COLORS.black} onPress={() => setShowFilter(false)} />
                <Text style={styles.filterTitle}>Filters</Text>
                <View />
              </View>

              <View style={styles.filterCategoriesContainer}>
                <Text style={styles.filterCategoriesText}>Categories</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={{ paddingVertical: SPACING.sm }}
                  renderItem={({ item }) => {
                    const isSelected = activeCategoryId === item.id;
                    return (
                      <TouchableOpacity
                        style={[styles.filterCategoriesColumnWrapper, isSelected && { backgroundColor: COLORS.secondary }]}
                        onPress={() => {
                          setActiveCategoryId(item.id);
                          setShowFilter(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.filterCategory, isSelected && { color: COLORS.primary, fontFamily: FONTS.montserrat.bold }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              <Text style={[styles.filterCategoriesText, { fontSize: rem(0.75), marginTop: 12 }]}>Price Limit (Max)</Text>
              <Slider
                style={{ width: "100%", height: 40, alignSelf: "center" }}
                minimumValue={50}
                maximumValue={2000}
                step={10}
                value={priceRange}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.grayHeavvy}
                thumbTintColor={COLORS.primary}
                onValueChange={(value) => setPriceRange(value)}
              />
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeText}>₹ 50</Text>
                <Text style={styles.priceRangeText}>₹ {priceRange}</Text>
              </View>

              <View style={styles.filterButtonContainer}>
                <Button
                  title="Clear"
                  variant="outline"
                  onPress={() => {
                    setActiveCategoryId("all");
                    setActiveFilter("Nearest To You");
                    setPriceRange(1000);
                    setShowFilter(false);
                  }}
                  style={{ width: "48%" }}
                  textStyle={{ fontSize: rem(0.9375) }}
                />
                <Button
                  title="Apply"
                  onPress={() => setShowFilter(false)}
                  style={{ width: "48%" }}
                  textStyle={{ fontSize: rem(0.9375) }}
                />
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

export default NearestBooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.grayHeavvy,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.black,
  },
  filtersWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  inlineMapButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayHeavvy,
    backgroundColor: COLORS.white,
    marginRight: SPACING.sm,
  },
  filtersContainer: {
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  filterChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grayHeavvy,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#00000069",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: rem(0.625),
    fontFamily: FONTS.montserrat.medium,
    color: COLORS.textMuted,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  filterTitle: {
    fontFamily: FONTS.manrope.bold,
    fontSize: rem(1.125),
    color: COLORS.black,
    textAlign: "center",
  },
  filterCategoriesText: {
    fontFamily: FONTS.manrope.bold,
    fontSize: rem(0.875),
    color: COLORS.text,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  filterCategoriesContainer: {
    marginTop: SPACING.xs,
  },
  filterCategoriesColumnWrapper: {
    flex: 1,
    margin: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grayHeavvy,
    justifyContent: "center",
    alignItems: "center",
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceRangeText: {
    fontFamily: FONTS.manrope.medium,
    fontSize: rem(0.75),
    color: COLORS.text,
    textAlign: "center",
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.lg,
    width: "100%",
    alignSelf: "center",
  },
  filterCategory: {
    fontFamily: FONTS.montserrat.medium,
    fontSize: rem(0.6875),
    color: COLORS.text,
    textAlign: "center",
  },
  activeFilterText: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  cardContainer: {
    width: CARD_WIDTH,
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  cardInner: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  bookCover: {
    width: "100%",
    borderRadius: 12,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.grayLight,
    height: 150,
  },
  bookTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
    textAlign: "center",
    width: "100%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SPACING.xs,
  },
  discountText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.primary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.primary,
  },
  priceText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.primary,
  },
  fab: {
    position: "absolute",
    bottom: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  filterModal: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
});
