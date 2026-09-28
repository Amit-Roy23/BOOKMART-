import Header from "@/components/ui/Header";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { router, useNavigation, useRoute } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";

const { width } = Dimensions.get("window");
const COLUMN_GAP = SPACING.md;
const PADDING_HORIZONTAL = SPACING.lg;
const BOOK_CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - COLUMN_GAP) / 2;

import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/clients";
import { BookCardSkeleton } from "@/components/skeleton/SkeletonLoader";

const getAuthorInitials = (name: string) => {
  if (!name) return "A";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const AuthorDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Author can come from either AuthorListScreen (Author type) or HomeScreen (AuthorItem type)
  const author = route.params?.author
    ? typeof route.params.author === "string"
      ? JSON.parse(route.params.author)
      : route.params.author
    : null;

  const { data: booksData, isLoading } = useQuery({
    queryKey: ["author-books", author?.name],
    queryFn: async () => {
      if (!author?.name) return null;
      const response = await api.get(`/api/v1/book/books/?search=${encodeURIComponent(author.name)}`);
      return response.data;
    },
    enabled: !!author?.name,
  });

  const authorBooks = React.useMemo(() => {
    if (!booksData?.results) return [];
    return booksData.results.map((item: any) => {
      const activeListing =
        item.cheapest_listing ||
        (item.listings && item.listings.length > 0 ? item.listings[0] : null) ||
        (item.ranked_listings && item.ranked_listings.length > 0 ? item.ranked_listings[0] : null);

      const listingId = activeListing?.id ? String(activeListing.id) : null;
      const price = activeListing
        ? parseFloat(activeListing.price)
        : item.lowest_price
        ? parseFloat(item.lowest_price)
        : 250;

      const imageUri =
        activeListing?.cover_image_url ||
        activeListing?.listing_images?.[0]?.image_url ||
        item.cover_url ||
        "";

      return {
        id: String(item.id),
        listingId: listingId,
        title: item.title,
        price: price,
        imageUri: imageUri,
        authorsList: item.authors || (author?.name ? [{ name: author.name }] : []),
        description: item.description || "",
      };
    });
  }, [booksData, author?.name]);

  if (!author) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorText}>Author not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.primary, fontFamily: FONTS.montserrat.semibold }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageSource = author.imageUri || author.photoUri || author.image_url || "";
  const category = author.category || author.designation || "Author";
  const rating = author.rating ? parseFloat(author.rating) : 4.8;

  // Fallback bio if empty
  const fullBio =
    author.bio && author.bio.trim().length > 10
      ? author.bio
      : "A prominent author known for producing critically acclaimed books and capturing the hearts of readers globally.";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Authors" backButton onPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {imageSource ? (
            <Image source={{ uri: imageSource }} style={styles.image} contentFit="fill" />
          ) : (
            <View style={[styles.image, styles.initialsContainer]}>
              <Text style={styles.initialsText}>{getAuthorInitials(author.name)}</Text>
            </View>
          )}
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.name}>{author.name}</Text>

          <View style={styles.ratingContainer}>
            <StarRating
              rating={rating}
              onChange={() => {}}
              maxStars={5}
              starSize={24}
              color={COLORS.yellow}
              enableSwiping={false}
              animationConfig={{ scale: 1 }}
              starStyle={{ marginHorizontal: 2 }}
            />
            <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{fullBio}</Text>
        </View>

        {/* Books Section */}
        <View style={styles.booksSection}>
          <Text style={styles.sectionTitle}>Books</Text>
          {isLoading ? (
            <View style={styles.booksGrid}>
              <BookCardSkeleton />
              <BookCardSkeleton />
            </View>
          ) : (
            <View style={styles.booksGrid}>
              {authorBooks.map((book: any) => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.bookCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: "/(screens)/BookDetails",
                      params: {
                        listingId: book.listingId || book.id,
                        book: JSON.stringify({
                          id: book.listingId || book.id,
                          bookId: book.id,
                          title: book.title,
                          coverUri: book.imageUri,
                          price: book.price,
                          authorsList: book.authorsList,
                          description: book.description,
                          condition: "Good",
                        }),
                        categoryTitle: category || "Author Books",
                      },
                    });
                  }}
                >
                  <Image source={{ uri: book.imageUri }} style={styles.bookCover} contentFit="fill" />
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <View style={styles.priceContainer}>
                    <View style={styles.currencyBadge}>
                      <Text style={styles.currencySymbol}>₹</Text>
                    </View>
                    <Text style={styles.bookPrice}>{book.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthorDetailsScreen;

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
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: rem(1.25),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.sm,
  },
  initialsContainer: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: rem(2),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  category: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: rem(1.25),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  aboutSection: {
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: rem(1.125),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  bioText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  booksSection: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: COLUMN_GAP,
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  bookCover: {
    width: "100%",
    height: BOOK_CARD_WIDTH * 1.25,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.grayLight,
  },
  bookTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  currencySymbol: {
    fontSize: rem(0.625),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.white,
  },
  bookPrice: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  errorText: {
    fontSize: rem(1),
    fontFamily: FONTS.montserrat.medium,
    color: COLORS.text,
  },
});
