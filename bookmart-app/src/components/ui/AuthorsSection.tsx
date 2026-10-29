import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthorItem {
  id: string;
  name: string;
  photoUri: string;
  bio?: string;
  rating?: number; // 0-5
}

// ── Layout constants ──────────────────────────────────────────────────────────

const HORIZONTAL_PADDING = rem(1.25); // 16
const COLLAPSED_WIDTH = rem(5);
const ITEM_GAP = rem(0.3125);

const SNAP_INTERVAL = SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLLAPSED_WIDTH;
const EXPANDED_WIDTH = SNAP_INTERVAL - ITEM_GAP;
const PHOTO_SIZE = COLLAPSED_WIDTH;
const CARD_HEIGHT = 135;

const LOOP_COPIES = 15;

// ── Module-scoped animation configs (never re-created) ────────────────────────

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 160,
  mass: 0.6,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

const WIDTH_SPRING = {
  damping: 22,
  stiffness: 180,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

const REVEAL_NAME = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
} as const;

const REVEAL_BIO = {
  duration: 260,
  easing: Easing.out(Easing.cubic),
} as const;

const REVEAL_STARS = {
  duration: 320,
  easing: Easing.out(Easing.cubic),
} as const;

// ── Star rating ───────────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number }> = memo(({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={[styles.star, i <= rating ? styles.starFilled : styles.starEmpty]}>
        ★
      </Text>
    );
  }
  return <View style={styles.starRow}>{stars}</View>;
});

// ── AuthorCard ────────────────────────────────────────────────────────────────

interface AuthorCardProps {
  item: AuthorItem;
  index: number;
  scrollX: SharedValue<number>;
  onPress?: (item: AuthorItem) => void;
}

const getAuthorInitials = (name: string) => {
  if (!name) return "A";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const AuthorCard: React.FC<AuthorCardProps> = memo(({ item, index, scrollX, onPress }) => {
  const center = index * SNAP_INTERVAL;
  const inputRange = [center - SNAP_INTERVAL, center, center + SNAP_INTERVAL] as const;

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  // ── Optimized Inline Animated Styles (0 useDerivedValue hooks!) ──────────

  const containerStyle = useAnimatedStyle(() => {
    "worklet";
    const progress = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const activeProgress = interpolate(progress, [0.3, 0.7], [0, 1], Extrapolation.CLAMP);

    const widthVal = interpolate(activeProgress, [0, 1], [COLLAPSED_WIDTH, EXPANDED_WIDTH]);

    return {
      width: widthVal,
    };
  });

  const nameStyle = useAnimatedStyle(() => {
    "worklet";
    const progress = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const activeProgress = interpolate(progress, [0.3, 0.7], [0, 1], Extrapolation.CLAMP);
    const opacity = interpolate(activeProgress, [0, 1], [0, 1], Extrapolation.CLAMP);
    const translateX = interpolate(activeProgress, [0, 1], [-10, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const bioStyle = useAnimatedStyle(() => {
    "worklet";
    const progress = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const activeProgress = interpolate(progress, [0.3, 0.7], [0, 1], Extrapolation.CLAMP);
    const opacity = interpolate(activeProgress, [0, 1], [0, 1], Extrapolation.CLAMP);
    const translateX = interpolate(activeProgress, [0, 1], [-8, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const starsStyle = useAnimatedStyle(() => {
    "worklet";
    const progress = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const activeProgress = interpolate(progress, [0.3, 0.7], [0, 1], Extrapolation.CLAMP);
    const opacity = interpolate(activeProgress, [0, 1], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(activeProgress, [0, 1], [0.5, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      {/* Fixed-width slot ── FlatList always sees this constant width */}
      <View style={styles.slot}>
        <Animated.View style={[styles.card, containerStyle]}>
          {/* Author photo ── real photo or initials fallback */}
          <View style={styles.photoWrap}>
            {item.photoUri ? (
              <Image
                source={{ uri: item.photoUri }}
                style={styles.photo}
                contentFit="cover"
                recyclingKey={item.photoUri}
                cachePolicy="memory-disk"
                placeholderContentFit="cover"
              />
            ) : (
              <View style={styles.initialsWrap}>
                <Text style={styles.initialsText}>{getAuthorInitials(item.name)}</Text>
              </View>
            )}
          </View>

          {/* Details ── staggered reveal: Name → Bio → Stars */}
          <View style={styles.details}>
            <Animated.Text style={[styles.authorName, nameStyle]} numberOfLines={2}>
              {item.name}
            </Animated.Text>

            {item.bio ? (
              <Animated.Text style={[styles.authorBio, bioStyle]} numberOfLines={6}>
                {item.bio}
              </Animated.Text>
            ) : null}

            {item.rating != null && item.rating > 0 ? (
              <Animated.View style={starsStyle}>
                <StarRating rating={item.rating} />
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
});

// ── AuthorsSection ────────────────────────────────────────────────────────────

export interface AuthorsSectionProps {
  authors?: AuthorItem[];
  onAuthorPress?: (author: AuthorItem) => void;
  onSeeAllPress?: () => void;
}

const AuthorsSection: React.FC<AuthorsSectionProps> = memo(
  ({ authors, onAuthorPress, onSeeAllPress }) => {
    if (!authors || authors.length === 0) {
      return null;
    }

    const listRef = useRef<any>(null);
    const scrollX = useSharedValue(0);
    const N = authors.length;

    // Replicate data for infinite loop
    const loopedData = useMemo(() => {
      const arr: Array<AuthorItem & { _key: string }> = [];
      for (let c = 0; c < LOOP_COPIES; c++) {
        for (let i = 0; i < N; i++) {
          arr.push({ ...authors[i], _key: `${authors[i].id}-${c}` });
        }
      }
      return arr;
    }, [authors, N]);

    const middleCopy = Math.floor(LOOP_COPIES / 2);
    const middleStartIndex = middleCopy * N;

    // Scroll to middle on mount
    useEffect(() => {
      if (N > 0 && listRef.current) {
        const timer = setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: middleStartIndex,
            animated: false,
          });
        }, 80);
        return () => clearTimeout(timer);
      }
    }, [middleStartIndex, N]);

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        "worklet";
        scrollX.value = event.contentOffset.x;
      },
    });

    // Reset to middle copy on momentum end near boundaries
    const handleMomentumScrollEnd = useCallback(
      (e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        const index = Math.round(x / SNAP_INTERVAL);
        const originalIdx = ((index % N) + N) % N;
        const newIndex = middleCopy * N + originalIdx;

        if (index < N * 2 || index > loopedData.length - N * 2) {
          listRef.current?.scrollToIndex({ index: newIndex, animated: false });
          scrollX.value = newIndex * SNAP_INTERVAL;
        }
      },
      [N, middleCopy, loopedData.length]
    );

    const renderItem = useCallback(
      ({ item, index }: { item: AuthorItem & { _key: string }; index: number }) => (
        <AuthorCard item={item} index={index} scrollX={scrollX} onPress={onAuthorPress} />
      ),
      [scrollX, onAuthorPress]
    );

    const keyExtractor = useCallback((item: any) => item._key, []);

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: SNAP_INTERVAL,
        offset: SNAP_INTERVAL * index,
        index,
      }),
      []
    );

    return (
      <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.section}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Authors</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
            <Text style={styles.headerLink}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {/* ── Infinite loop carousel ── */}
        <Animated.FlatList
          ref={listRef}
          horizontal
          data={loopedData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          bounces={false}
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={40}
        />
      </LinearGradient>
    );
  }
);

export default AuthorsSection;

// ── Styles ────────────────────────────────────────────────────────────────────

const CARD_BG = COLORS.text;

const styles = StyleSheet.create({
  section: {
    marginTop: rem(1.25),
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: rem(0.5),
  },
  headerTitle: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
  },
  headerLink: {
    fontSize: rem(0.75),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 4,
  },

  // ── Fixed-width slot ── every item occupies exactly SNAP_INTERVAL ──
  slot: {
    width: SNAP_INTERVAL,
    height: CARD_HEIGHT,
  },

  // ── Card (animated width inside the fixed slot) ──
  card: {
    height: CARD_HEIGHT,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  // ── Photo ──
  photoWrap: {
    width: PHOTO_SIZE,
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  initialsWrap: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontSize: rem(1.25),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },

  // ── Details column ──
  details: {
    width: EXPANDED_WIDTH - PHOTO_SIZE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  authorName: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.white,
    marginBottom: 6,
  },
  authorBio: {
    fontSize: rem(0.625),
    fontFamily: FONTS.manrope.light,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 14,
    marginBottom: 6,
  },

  // ── Star rating ──
  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: rem(0.8125),
  },
  starFilled: {
    color: COLORS.yellow,
  },
  starEmpty: {
    color: COLORS.textMuted,
  },
});
