import { api } from "@/api/clients";
import BooksBottomSheet from "@/components/map/BooksBottomSheet";
import LeafletMapView, { LeafletMapViewRef } from "@/components/map/LeafletMapView";
import UserLocationButton from "@/components/map/UserLocationButton";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router, useNavigation, useRoute } from "expo-router";
import Constants, { ExecutionEnvironment } from "expo-constants";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

// Mock User Location fallback (Naihati Railway Station)
const MOCK_USER_LOCATION = {
  latitude: 22.8943,
  longitude: 88.4239,
};

// Memoized Category Chip component
const CategoryChip = React.memo(
  ({
    cat,
    isActive,
    onPress,
  }: {
    cat: { id: string; name: string };
    isActive: boolean;
    onPress: (id: string) => void;
  }) => {
    const handlePress = useCallback(() => {
      onPress(cat.id);
    }, [cat.id, onPress]);

    return (
      <TouchableOpacity
        style={[styles.categoryChip, isActive && styles.categoryChipActive]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat.name}</Text>
      </TouchableOpacity>
    );
  }
);

const NearestBooksMapScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mapRef = useRef<LeafletMapViewRef>(null);
  const prevLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(route.params?.categoryId || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Location permission & status flags
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<"checking" | "granted" | "denied">(
    "checking"
  );
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(true);
  const [isUsingMockLocation, setIsUsingMockLocation] = useState<boolean>(false);

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/v1/core/profile/me/");
      return response.data;
    },
  });

  // Fetch real listings
  const { data: listingsData } = useQuery({
    queryKey: ["all-listings"],
    queryFn: async () => {
      const response = await api.get("/api/v1/marketplace/listings/");
      return response.data;
    },
  });

  // Fetch categories (genres)
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.get("/api/v1/book/genres/");
      return response.data;
    },
  });

  const FIXED_CATEGORIES = useMemo(
    () => [
      { id: "all", name: "All", slug: "all" },
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

  const handleCategoryPress = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSelectedBookId(null);
  }, []);

  const processedBooks = useMemo(() => {
    if (!listingsData) return [];
    const rawListings = Array.isArray(listingsData) ? listingsData : listingsData?.results || [];
    if (rawListings.length === 0) return [];

    const baseLat = userLocation?.latitude || MOCK_USER_LOCATION.latitude;
    const baseLng = userLocation?.longitude || MOCK_USER_LOCATION.longitude;

    let books = rawListings.map((item: any, index: number) => {
      let lat = item.latitude ? parseFloat(item.latitude) : null;
      let lng = item.longitude ? parseFloat(item.longitude) : null;

      if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
        const angle = (index * 137.5 * Math.PI) / 180;
        const radius = 0.003 + (index % 5) * 0.002;
        lat = baseLat + radius * Math.cos(angle);
        lng = baseLng + radius * Math.sin(angle);
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
        latitude: lat,
        longitude: lng,
        genreSlug,
        genre: genreName,
        discount: "20% off",
        condition: item.condition || "GOOD",
        categoryId: item.book?.genres?.[0]?.id ? String(item.book.genres[0].id) : genreSlug,
        sellerName: item.seller?.full_name || "Seller",
      };
    });

    // Filter by category
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

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      books = books.filter(
        (b: any) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    return books;
  }, [listingsData, userLocation, activeCategoryId, searchQuery, categories]);

  // OSRM route fetcher
  useEffect(() => {
    if (selectedBookId && userLocation) {
      const book = processedBooks.find((b: any) => b.id === selectedBookId);
      if (book?.latitude && book?.longitude) {
        fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${book.longitude},${book.latitude}?overview=full&geometries=geojson`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              const coords = data.routes[0].geometry.coordinates.map((coord: any) => ({
                latitude: coord[1],
                longitude: coord[0],
              }));
              setRouteCoords(coords);

              const distKm = (data.routes[0].distance / 1000).toFixed(1);
              const durMin = Math.round(data.routes[0].duration / 60);
              setRouteInfo({ distance: `${distKm} km`, duration: `${durMin} min` });
            }
          })
          .catch((err) => console.log("OSRM Error:", err));
      }
    } else {
      setRouteCoords([]);
      setRouteInfo(null);
    }
  }, [selectedBookId, userLocation, processedBooks]);

  // Robust location requester
  const requestLocation = useCallback(async () => {
    try {
      setLocationPermissionStatus("checking");
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      setLocationServicesEnabled(servicesEnabled);

      if (!servicesEnabled) {
        setIsUsingMockLocation(true);
        setUserLocation(MOCK_USER_LOCATION);
        setLocationPermissionStatus("denied");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status === "granted" ? "granted" : "denied");

      if (status !== "granted") {
        setIsUsingMockLocation(true);
        setUserLocation(MOCK_USER_LOCATION);
        return;
      }

      let location = null;
      try {
        location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }
      } catch (err) {
        console.error("Failed to get device current location coordinate:", err);
      }

      if (location && location.coords) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setIsUsingMockLocation(false);
      } else {
        setIsUsingMockLocation(true);
        setUserLocation(MOCK_USER_LOCATION);
      }
    } catch (error) {
      console.error("Error checking location setup:", error);
      setIsUsingMockLocation(true);
      setUserLocation(MOCK_USER_LOCATION);
      setLocationPermissionStatus("denied");
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Animate map camera to user location when location changes
  useEffect(() => {
    if (userLocation) {
      mapRef.current?.centerOnUser();
    }
  }, [userLocation]);

  const handleBookPress = useCallback(
    (book: any) => {
      setSelectedBookId((prev) => {
        const isClosing = prev === book.id;
        const newSelectedId = isClosing ? null : book.id;
        if (!isClosing && book.latitude && book.longitude && userLocation) {
          mapRef.current?.fitToCoordinates([
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: book.latitude, longitude: book.longitude },
          ]);
        }
        return newSelectedId;
      });
      setBottomSheetVisible(true);
    },
    [userLocation]
  );

  const handleCenterLocation = useCallback(() => {
    mapRef.current?.centerOnUser();
  }, []);

  const handleToggleScreen = useCallback(() => {
    router.push({
      pathname: "/(screens)/NearestBooks",
      params: { categoryId: activeCategoryId },
    });
  }, [activeCategoryId]);

  const handleOpenSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  if (!userLocation && locationPermissionStatus === "checking") {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Initializing Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LeafletMapView
        ref={mapRef}
        userLocation={userLocation}
        books={processedBooks}
        selectedBookId={selectedBookId}
        onBookPress={handleBookPress}
        routeCoords={routeCoords}
      />

      <LinearGradient
        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.8)", "transparent"]}
        style={[styles.headerGradient, { paddingTop: insets.top + SPACING.sm }]}
        pointerEvents="box-none"
      >
        {isUsingMockLocation && (
          <View style={styles.warningBanner}>
            <Ionicons name="location-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
            <Text style={styles.warningBannerText} numberOfLines={1}>
              {!locationServicesEnabled
                ? "GPS is disabled. Showing default location."
                : "Location denied. Showing default location."}
            </Text>
            <TouchableOpacity
              style={styles.warningBannerAction}
              onPress={!locationServicesEnabled ? requestLocation : handleOpenSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.warningBannerActionText}>{!locationServicesEnabled ? "Retry" : "Enable"}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.categoriesRow}>
          <TouchableOpacity onPress={handleToggleScreen} style={styles.filterBtn}>
            <Ionicons name="list" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return <CategoryChip key={cat.id} cat={cat} isActive={isActive} onPress={handleCategoryPress} />;
            })}
          </ScrollView>
        </View>
      </LinearGradient>

      <View style={[styles.locationButtonContainer, { bottom: insets.bottom + (bottomSheetVisible ? 290 : 80) }]}>
        <UserLocationButton onPress={handleCenterLocation} />
      </View>

      {routeInfo && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.routeBadge, { top: insets.top + 100 }]}>
          <Ionicons name="car" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
          <Text style={styles.routeBadgeText}>
            {routeInfo.duration} ({routeInfo.distance})
          </Text>
        </Animated.View>
      )}

      {!bottomSheetVisible && (
        <TouchableOpacity
          style={[styles.listToggleButton, { bottom: insets.bottom + 20 }]}
          onPress={() => setBottomSheetVisible(true)}
        >
          <Ionicons name="list" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
          <Text style={styles.listToggleText}>List View</Text>
        </TouchableOpacity>
      )}

      <BooksBottomSheet
        books={processedBooks}
        selectedBookId={selectedBookId}
        onBookPress={handleBookPress}
        userLocation={userLocation}
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
      />
    </View>
  );
};

export default NearestBooksMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: FONTS.manrope.medium,
    fontSize: rem(0.875),
    color: COLORS.textMuted,
  },
  map: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorText: {
    fontFamily: FONTS.manrope.medium,
    fontSize: rem(0.875),
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  retryButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontFamily: FONTS.montserrat.bold,
    fontSize: rem(0.75),
    color: COLORS.white,
  },
  userLocationMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 128, 128, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.red,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  warningBannerText: {
    flex: 1,
    fontFamily: FONTS.manrope.medium,
    fontSize: rem(0.6875),
    color: COLORS.white,
  },
  warningBannerAction: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  warningBannerActionText: {
    fontFamily: FONTS.manrope.semibold,
    fontSize: rem(0.625),
    color: COLORS.white,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SPACING.md,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.15)",
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.black,
  },
  categoriesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.15)",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  categoriesScroll: {
    gap: SPACING.xs,
    paddingRight: SPACING.xl,
  },
  categoryChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.15)",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.montserrat.medium,
    fontSize: rem(0.6875),
    color: COLORS.textMuted,
  },
  categoryTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.montserrat.bold,
  },
  locationButtonContainer: {
    position: "absolute",
    right: SPACING.lg,
    zIndex: 5,
  },
  routeBadge: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  routeBadgeText: {
    fontFamily: FONTS.manrope.semibold,
    fontSize: rem(0.75),
    color: COLORS.white,
  },
  listToggleButton: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  listToggleText: {
    fontFamily: FONTS.montserrat.bold,
    fontSize: rem(0.75),
    color: COLORS.white,
  },
});
