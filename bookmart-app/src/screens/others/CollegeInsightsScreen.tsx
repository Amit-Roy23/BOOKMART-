import { Button } from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import HeartBurst from "@/components/ui/HeartBrust";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/clients";

const CollegeBookCard = ({ book }: { book: any }) => {
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
    return wishlistData.find((w: any) => String(w.listing.id) === String(book.id));
  }, [wishlistData, book.id]);

  const isLiked = !!wishlistEntry;

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isLiked && wishlistEntry) {
        await api.delete(`/api/v1/marketplace/wishlist/${wishlistEntry.id}/`);
      } else {
        await api.post("/api/v1/marketplace/wishlist/", { listing: book.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleFavorite = () => {
    if (!isLiked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 700);
    }
    toggleWishlistMutation.mutate();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.bookCardContainer}
      onPress={() =>
        router.push({
          pathname: "/(screens)/BookDetails",
          params: { listingId: book.id, categoryTitle: "College" },
        })
      }
    >
      <View style={styles.bookCard}>
        <View style={styles.bookCoverWrap}>
          <Image source={{ uri: book.coverUri }} style={styles.bookCover} contentFit="cover" />
          <TouchableOpacity activeOpacity={0.6} style={styles.favBtn} onPress={handleFavorite}>
            {showBurst && (
              <View style={styles.burstContainer}>
                <HeartBurst />
              </View>
            )}
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.bookTitle} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {book.author}
      </Text>
      <Text style={styles.bookPrice}>₹{book.price}</Text>

      <View style={styles.bookMetrics}>
        <View style={styles.metricItem}>
          <Ionicons name="eye-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metricText}>{book.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CollegeInsightsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Fetch real user profile
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

  // Fetch real colleges
  const { data: collegesData } = useQuery({
    queryKey: ["colleges-list"],
    queryFn: async () => {
      const response = await api.get("/api/v1/core/colleges/");
      return response.data;
    },
  });

  const allListings = useMemo(() => {
    return Array.isArray(listingsData) ? listingsData : listingsData?.results || [];
  }, [listingsData]);

  const colleges = useMemo(() => {
    return Array.isArray(collegesData) ? collegesData : collegesData?.results || [];
  }, [collegesData]);

  const userCollege = userProfile?.college || (colleges.length > 0 ? colleges[0] : null);

  const collegeBooks = useMemo(() => {
    if (!userCollege || allListings.length === 0) return [];
    const collegeId = userCollege.id;
    return allListings
      .filter((item: any) => item.seller?.profile?.college?.id === collegeId)
      .map((item: any) => ({
        id: String(item.id),
        title: item.book?.title || item.title || "Untitled Book",
        author: item.book?.authors?.map((a: any) => (typeof a === "string" ? a : a.name)).join(", ") || "Unknown Author",
        price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
        coverUri: item.listing_images?.[0]?.image_url || item.book?.cover_url || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop",
        views: item.views_count || 0,
      }));
  }, [allListings, userCollege]);

  const totalCollegeViews = useMemo(() => {
    return collegeBooks.reduce((acc: number, b: any) => acc + (b.views || 0), 0);
  }, [collegeBooks]);

  const renderActivitySection = () => {
    if (!userCollege) return null;

    return (
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Your College Activity</Text>
        <Text style={styles.sectionSub}>See how many students from your college are using BookMart.</Text>

        <View style={styles.collegeCard}>
          <View style={styles.collegeCardLeft}>
            <View style={styles.collegeIconWrap}>
              <Ionicons name="school-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.collegeTextWrap}>
              <Text style={styles.collegeName} numberOfLines={1}>
                {userCollege.name}
              </Text>
              <Text style={styles.collegeUniv} numberOfLines={1}>
                {userCollege.district ? `${userCollege.district}, ${userCollege.state}` : userCollege.state || "Campus"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="book-outline" size={20} color={COLORS.primary} style={styles.statIcon} />
            <Text style={styles.statNum}>{collegeBooks.length}</Text>
            <Text style={styles.statTitle}>Books Listed</Text>
            <Text style={styles.statDesc}>By your college</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="eye-outline" size={20} color={COLORS.primary} style={styles.statIcon} />
            <Text style={styles.statNum}>{totalCollegeViews}</Text>
            <Text style={styles.statTitle}>Total Views</Text>
            <Text style={styles.statDesc}>On college books</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBooksSection = () => {
    if (collegeBooks.length === 0) return null;

    return (
      <View style={styles.booksSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleSmall}>Books from Your College</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksScrollContent}>
          {collegeBooks.map((book: any) => (
            <CollegeBookCard key={book.id} book={book} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderTopColleges = () => {
    if (colleges.length === 0) return null;

    return (
      <View style={styles.topCollegesSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitleSmall}>Participating Colleges</Text>
            <Text style={styles.sectionSubSmall}>Colleges active on BookMart</Text>
          </View>
        </View>

        <View style={styles.leaderboardList}>
          {colleges.slice(0, 5).map((college: any, index: number) => {
            const count = allListings.filter((l: any) => l.seller?.profile?.college?.id === college.id).length;
            return (
              <View key={college.id} style={styles.leaderboardItem}>
                <Text style={styles.rankText}>{index + 1}</Text>
                <View style={styles.collegeLogoWrap}>
                  <Ionicons name="school" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName} numberOfLines={1}>
                    {college.name}
                  </Text>
                  <Text style={styles.leaderboardUniv} numberOfLines={1}>
                    {college.district ? `${college.district}, ${college.state}` : college.state}
                  </Text>
                </View>
                <View style={styles.leaderboardRight}>
                  <Text style={styles.leaderboardBooks}>{count}</Text>
                  <Text style={styles.leaderboardBooksLabel}>Listed</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <Header
        title="College Insights"
        backButton
        rightElement={
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderActivitySection()}
        {renderBooksSection()}
        {renderTopColleges()}

        <View style={styles.inviteCard}>
          <View style={styles.inviteIconWrap}>
            <Ionicons name="people" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.inviteInfo}>
            <Text style={styles.inviteTitle}>Invite More Students</Text>
            <Text style={styles.inviteDesc}>
              Help more students from your college discover and buy & sell books.
            </Text>
          </View>
          <Button
            title="Invite"
            style={styles.inviteBtn}
            textStyle={styles.inviteBtnText}
            icon={<Ionicons name="share-social" size={12} color={COLORS.white} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CollegeInsightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: SPACING.md,
  },
  activitySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: rem(1),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSub: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  collegeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  collegeCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  collegeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  collegeTextWrap: {
    flex: 1,
  },
  collegeName: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.black,
  },
  collegeUniv: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    marginBottom: 4,
  },
  statNum: {
    fontSize: rem(1),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
  },
  statTitle: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.text,
    textAlign: "center",
  },
  statDesc: {
    fontSize: rem(0.5625),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  booksSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitleSmall: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
  },
  sectionSubSmall: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  booksScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  bookCardContainer: {
    width: 120,
    marginRight: SPACING.sm,
  },
  bookCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    marginBottom: 6,
  },
  bookCoverWrap: {
    width: 120,
    height: 160,
    position: "relative",
  },
  bookCover: {
    width: "100%",
    height: "100%",
  },
  favBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.white,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  burstContainer: {
    position: "absolute",
  },
  bookTitle: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.black,
  },
  bookAuthor: {
    fontSize: rem(0.65),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
  },
  bookPrice: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.primary,
    marginTop: 2,
  },
  bookMetrics: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  metricText: {
    fontSize: rem(0.6),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  topCollegesSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  leaderboardList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  rankText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
    width: 24,
  },
  collegeLogoWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.semibold,
    color: COLORS.black,
  },
  leaderboardUniv: {
    fontSize: rem(0.625),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
  },
  leaderboardRight: {
    alignItems: "flex-end",
  },
  leaderboardBooks: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.black,
  },
  leaderboardBooksLabel: {
    fontSize: rem(0.5625),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
  },
  inviteCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    flexDirection: "row",
    alignItems: "center",
  },
  inviteIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.black,
  },
  inviteDesc: {
    fontSize: rem(0.625),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
  },
  inviteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 32,
    borderRadius: 16,
  },
  inviteBtnText: {
    fontSize: rem(0.6875),
  },
});
