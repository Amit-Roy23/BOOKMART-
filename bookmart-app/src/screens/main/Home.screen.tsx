import { api } from "@/api/clients";
import HomeSkeleton from "@/components/skeleton/HomeSkeleton/HomeSkeleton";
import EditorsChoiceComp from "@/components/smallComp/EditorsChoiceComp";
import EndingSoon from "@/components/smallComp/EndingSoon";
import ExcellentCondition from "@/components/smallComp/ExcellentCondition";
import PeopleViewing from "@/components/smallComp/PeopleViewing";
import RecentlyAdded from "@/components/smallComp/RecentlyAdded";
import SponsoredSection from "@/components/smallComp/SponsoredSection";
import MyListingsSection from "@/components/smallComp/MyListingsSection";
import AuthorsSection, { AuthorItem } from "@/components/ui/AuthorsSection";
import GenreSection from "@/components/ui/GenreSection";
import HomeHeader from "@/components/ui/HomeHeader";
import InstituteBooks from "@/components/ui/InstituteBooks";
import NearestBooks from "@/components/ui/NearestBooks";
import PromoBanner, { PromoBannerItem } from "@/components/ui/PromoBanner";
import SearchBar from "@/components/ui/SearchBar";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  // ── Queries ──
  const { data: userProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/v1/core/profile/me/");
      return response.data;
    },
  });

  const {
    data: listingsData,
    isLoading: isLoadingListings,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ["all-listings"],
    queryFn: async () => {
      const response = await api.get("/api/v1/marketplace/listings/");
      return response.data;
    },
  });

  const { data: recommendationsData, refetch: refetchRecommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await api.get("/api/v1/book/recommendations/");
      return response.data;
    },
  });

  const { data: authorsData, refetch: refetchAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await api.get("/api/v1/book/authors/");
      return response.data;
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Promise.all([
        refetchListings(),
        refetchProfile(),
        refetchRecommendations(),
        refetchAuthors(),
      ]);
    } catch (err) {
      console.log("Error refreshing home feed:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetchListings, refetchProfile, refetchRecommendations, refetchAuthors]);

  // All active listings available for Home screen feeds
  const allListings = useMemo(() => {
    if (!listingsData) return [];
    return Array.isArray(listingsData) ? listingsData : listingsData?.results || [];
  }, [listingsData]);

  // ── Mappers ──
  const mapListingToBook = useCallback(
    (item: any) => ({
      id: String(item.id),
      title: item.book?.title || item.title || "Untitled Book",
      author:
        item.book?.authors?.map((a: any) => (typeof a === "string" ? a : a.name)).join(", ") ||
        "Unknown Author",
      price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
      coverUri:
        item.listing_images?.[0]?.image_url ||
        item.book?.cover_url ||
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop",
      condition: item.condition || "GOOD",
      distance: item.distance_km ? `${item.distance_km.toFixed(1)}km` : "Nearby",
      description: item.condition_notes || item.book?.description || "",
      sellerName: item.seller?.full_name || "Seller",
      sellerAvatarUri: item.seller?.profile_image || "",
      views: item.views_count || 0,
    }),
    []
  );

  const currentUserId = userProfile?.user_id || userProfile?.user?.id || userProfile?.id;

  // User's own listings
  const myListings = useMemo(() => {
    if (!allListings || allListings.length === 0 || !currentUserId) return [];
    return allListings
      .filter((item: any) => {
        const sellerId = item.seller?.id ?? item.seller_id;
        return String(sellerId) === String(currentUserId);
      })
      .map(mapListingToBook);
  }, [allListings, currentUserId, mapListingToBook]);

  const sponsoredBooks = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return allListings.filter((item: any) => item.is_boosted).map(mapListingToBook);
  }, [allListings, mapListingToBook]);

  const nearestBooks = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return allListings.slice(0, 6).map(mapListingToBook);
  }, [allListings, mapListingToBook]);

  const collegeBooks = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    const collegeId = userProfile?.college?.id;
    const filtered = allListings.filter(
      (item: any) => !collegeId || item.seller?.profile?.college?.id === collegeId
    );
    return (filtered.length > 0 ? filtered : allListings).slice(0, 6).map(mapListingToBook);
  }, [allListings, userProfile, mapListingToBook]);

  const recentlyAdded = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return [...allListings]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
      .map(mapListingToBook);
  }, [allListings, mapListingToBook]);

  const excellentCondition = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return allListings
      .filter((item: any) => item.condition === "NEW" || item.condition === "LIKE_NEW")
      .slice(0, 6)
      .map(mapListingToBook);
  }, [allListings, mapListingToBook]);

  const peopleViewing = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return [...allListings]
      .sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 5)
      .map(mapListingToBook);
  }, [allListings, mapListingToBook]);

  const calculateTimeLeft = useCallback((createdAt?: string): string => {
    if (!createdAt) return "12d left";
    const createdTime = new Date(createdAt).getTime();
    if (isNaN(createdTime)) return "12d left";

    const now = Date.now();
    const elapsedMs = Math.max(0, now - createdTime);
    const totalUltimatumMs = 12 * 24 * 60 * 60 * 1000;
    const remainingMs = totalUltimatumMs - elapsedMs;

    if (remainingMs <= 0) {
      return "Ending today";
    }

    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    if (remainingDays > 1) {
      return `${remainingDays}d left`;
    }

    const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
    if (remainingHours > 1) {
      return `${remainingHours}h left`;
    }

    return "Ending today";
  }, []);

  const endingSoon = useMemo(() => {
    if (!allListings || allListings.length === 0) return [];
    return [...allListings]
      .map((item: any) => {
        const createdTime = item.created_at ? new Date(item.created_at).getTime() : Date.now();
        const elapsedMs = Math.max(0, Date.now() - (isNaN(createdTime) ? Date.now() : createdTime));
        const totalUltimatumMs = 12 * 24 * 60 * 60 * 1000;
        const remainingMs = totalUltimatumMs - elapsedMs;
        return {
          ...mapListingToBook(item),
          remainingMs,
          timeLeft: calculateTimeLeft(item.created_at),
        };
      })
      .sort((a, b) => a.remainingMs - b.remainingMs)
      .slice(0, 6);
  }, [allListings, mapListingToBook, calculateTimeLeft]);

  const editorsChoice = useMemo(() => {
    if (!recommendationsData?.results || recommendationsData.results.length === 0) return null;
    for (const item of recommendationsData.results) {
      const allRecListings = item.ranked_listings || item.listings || [];
      if (allRecListings.length > 0) {
        const validListing = allRecListings[0];
        return {
          id: String(validListing.id),
          title: item.title,
          author: item.authors?.map((a: any) => a.name).join(", ") || "Unknown Author",
          price: parseFloat(validListing.price) || 250,
          coverUri:
            validListing?.listing_images?.[0]?.image_url ||
            item.cover_url ||
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop",
          condition: validListing?.condition || "Good",
          distance: "2km",
        };
      }
    }
    return null;
  }, [recommendationsData]);

  const authors = useMemo(() => {
    if (!authorsData?.results || !allListings || allListings.length === 0) return [];

    const activeAuthorIds = new Set<string>();
    const activeAuthorNames = new Set<string>();

    for (const item of allListings) {
      if (item.book?.authors && Array.isArray(item.book.authors)) {
        for (const a of item.book.authors) {
          if (a.id) activeAuthorIds.add(String(a.id));
          if (a.name) activeAuthorNames.add(a.name.toLowerCase().trim());
        }
      }
    }

    return authorsData.results
      .filter((item: any) => {
        const idMatch = activeAuthorIds.has(String(item.id));
        const nameMatch = item.name ? activeAuthorNames.has(item.name.toLowerCase().trim()) : false;
        return idMatch || nameMatch;
      })
      .map((item: any) => ({
        id: String(item.id),
        name: item.name,
        photoUri: item.image_url || "",
        bio: item.bio || "",
        rating: parseFloat(item.rating) || 5,
      }));
  }, [authorsData, allListings]);

  const handleNotificationPress = useCallback(() => {
    router.push("/(screens)/Notifications");
  }, []);

  const handleAvatarPress = useCallback(() => {
    router.push("/(screens)/EditProfile");
  }, []);

  const handleCtaPress = useCallback((banner: PromoBannerItem) => {
    router.push("/(screens)/Search");
  }, []);

  const handleBookPress = useCallback((book: any) => {
    router.push({
      pathname: "/(screens)/BookDetails",
      params: { listingId: book.id, categoryTitle: "Non-Fiction" },
    });
  }, []);

  const handleSeeAllPress = useCallback(() => {
    router.push("/(screens)/NearestBooksMap");
  }, []);

  const handleInstituteBookPress = useCallback((book: any) => {
    router.push({
      pathname: "/(screens)/BookDetails",
      params: { listingId: book.id, categoryTitle: "Textbooks" },
    });
  }, []);

  const handleInstituteSeeAllPress = useCallback(() => {
    router.push("/(screens)/CollegeInsights");
  }, []);

  const handleAuthorPress = useCallback((author: AuthorItem) => {
    router.push({
      pathname: "/(screens)/AuthorDetails",
      params: { author: JSON.stringify(author) },
    });
  }, []);

  const handleAuthorSeeAllPress = useCallback(() => {
    router.push("/(screens)/AuthorList");
  }, []);

  if (isLoadingListings) {
    return <HomeSkeleton />;
  }

  const hasAnyListings = allListings.length > 0;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <HomeHeader
        locationName={userProfile?.city_location || "Campus Area"}
        notificationCount={3}
        onNotificationPress={handleNotificationPress}
        onAvatarPress={handleAvatarPress}
      />

      {/* ── Search Bar ── */}
      <SearchBar onPress={() => router.push("/(screens)/Search")} editable={false} onClearPress={() => {}} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.white}
          />
        }
      >
        {/* ── Promo Carousel ── */}
        <PromoBanner onCtaPress={handleCtaPress} />

        {/* ── Categories ── */}
        <GenreSection />

        {/* ── User's Own Active Listings ── */}
        {myListings.length > 0 && (
          <MyListingsSection
            books={myListings}
            onBookPress={handleBookPress}
            onManagePress={() => router.push("/(screens)/MyActiveListings" as any)}
            onAddPress={() => router.push("/(tabs)/create" as any)}
          />
        )}

        {/* ── Trending / Sponsored ── */}
        {sponsoredBooks.length > 0 && <SponsoredSection books={sponsoredBooks} onBookPress={handleBookPress} />}

        {/* ── Nearest Books ── */}
        {nearestBooks.length > 0 && (
          <NearestBooks books={nearestBooks} onBookPress={handleBookPress} onSeeAllPress={handleSeeAllPress} />
        )}

        {/* ── Authors (Shown only when authors have listed books) ── */}
        {authors.length > 0 && (
          <AuthorsSection
            authors={authors}
            onAuthorPress={handleAuthorPress}
            onSeeAllPress={handleAuthorSeeAllPress}
          />
        )}

        {/* ── Recently Added ── */}
        {recentlyAdded.length > 0 && (
          <RecentlyAdded title="Recently Added" books={recentlyAdded} onBookPress={handleBookPress} />
        )}

        {/* ── Excellent Condition ── */}
        {excellentCondition.length > 0 && (
          <ExcellentCondition title="Excellent Condition" books={excellentCondition} onBookPress={handleBookPress} />
        )}

        {/* ── People Are Viewing ── */}
        {peopleViewing.length > 0 && (
          <PeopleViewing title="People Are Viewing" books={peopleViewing} onBookPress={handleBookPress} />
        )}

        {/* ── Ending Soon ── */}
        {endingSoon.length > 0 && <EndingSoon title="Ending Soon" books={endingSoon} onBookPress={handleBookPress} />}

        {/* ── Empty State when no book listings are available ── */}
        {!hasAnyListings && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconWrap}>
              <Ionicons name="book-outline" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyStateTitle}>No Book Listings Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Be the first in your campus or neighborhood to list a pre-owned book!
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.emptyStateButton}
              onPress={() => router.push("/(tabs)/create" as any)}
            >
              <Ionicons name="add-circle" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
              <Text style={styles.emptyStateButtonText}>List a Book</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: rem(7.5), // room for floating tab bar
  },
  emptyStateContainer: {
    marginHorizontal: SPACING.lg,
    marginTop: rem(1.5),
    padding: rem(1.5),
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyStateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: rem(1),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.black,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.white,
  },
});

