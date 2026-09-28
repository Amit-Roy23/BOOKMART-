import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NearestBookItem } from "../ui/NearestBooks";

const CARD_WIDTH = rem(8.5);

interface MyListingsSectionProps {
  title?: string;
  books: NearestBookItem[];
  onBookPress?: (book: NearestBookItem) => void;
  onManagePress?: () => void;
  onAddPress?: () => void;
}

const MyListingCard = memo(
  ({ item, onPress }: { item: NearestBookItem; onPress?: (item: NearestBookItem) => void }) => {
    const handlePress = useCallback(() => {
      onPress?.(item);
    }, [item, onPress]);

    return (
      <Pressable onPress={handlePress} style={styles.card}>
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: item.coverUri }}
            style={styles.coverImg}
            contentFit="cover"
            recyclingKey={item.coverUri}
            cachePolicy="memory-disk"
          />
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.infoWrap}>
          <Text numberOfLines={1} style={styles.titleText}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.authorText}>
            {item.author}
          </Text>
          <View style={styles.footerRow}>
            <Text style={styles.priceText}>₹{item.price}</Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
  (prev, next) => prev.item.id === next.item.id
);

const MyListingsSection: React.FC<MyListingsSectionProps> = memo(
  ({ title = "Your Active Listings", books, onBookPress, onManagePress, onAddPress }) => {
    if (!books || books.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.titleIconWrap}>
              <Ionicons name="book" size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{books.length}</Text>
            </View>
          </View>
          {onManagePress && (
            <Pressable onPress={onManagePress} hitSlop={8}>
              <Text style={styles.headerLink}>MANAGE</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {books.map((book) => (
            <MyListingCard key={book.id} item={book} onPress={onBookPress} />
          ))}

          {onAddPress && (
            <Pressable onPress={onAddPress} style={styles.addCard}>
              <View style={styles.addIconWrap}>
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.addCardTitle}>List Another</Text>
              <Text style={styles.addCardSub}>Add pre-owned book</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    );
  }
);

export default MyListingsSection;

const styles = StyleSheet.create({
  section: {
    marginTop: rem(1.25),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: rem(0.5),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: rem(0.5625),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.white,
  },
  headerLink: {
    fontSize: rem(0.75),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    gap: rem(0.625),
    paddingBottom: 4,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.12)",
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  coverWrap: {
    width: "100%",
    height: rem(7.5),
    position: "relative",
    backgroundColor: COLORS.background,
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 128, 128, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#A7F3D0",
  },
  statusText: {
    fontSize: rem(0.46875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  infoWrap: {
    padding: rem(0.5),
  },
  titleText: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.text,
  },
  authorText: {
    fontSize: rem(0.5625),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  priceText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  conditionBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  conditionText: {
    fontSize: rem(0.46875),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.primary,
  },
  addCard: {
    width: rem(6.5),
    height: rem(11.5),
    borderRadius: rem(0.75),
    borderWidth: 1.5,
    borderColor: "rgba(0, 128, 128, 0.25)",
    borderStyle: "dashed",
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    padding: rem(0.5),
  },
  addIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addCardTitle: {
    fontSize: rem(0.625),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.primary,
    textAlign: "center",
  },
  addCardSub: {
    fontSize: rem(0.5),
    fontFamily: FONTS.manrope.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
});
