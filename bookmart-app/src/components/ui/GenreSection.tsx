import { router, useNavigation } from "expo-router";
import React, { memo, useCallback, useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";

export interface GenreItem {
  id: string;
  label: string;
  screenName: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
}

export const CATEGORIES: GenreItem[] = [
  {
    id: "fiction",
    label: "Fiction",
    screenName: "Fiction",
    icon: "planet",
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    id: "academic",
    label: "Academic",
    screenName: "Academic",
    icon: "school",
    backgroundColor: "#F0FDF4",
    borderColor: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "self-help",
    label: "Self Help",
    screenName: "SelfHelp",
    icon: "leaf",
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
    iconColor: "#059669",
  },
  {
    id: "biography",
    label: "Biography",
    screenName: "Biography",
    icon: "finger-print",
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
    iconColor: "#D97706",
  },
  {
    id: "business",
    label: "Business",
    screenName: "Business",
    icon: "briefcase",
    backgroundColor: "#FDF4FF",
    borderColor: "#FAE8FF",
    iconColor: "#9333EA",
  },
  {
    id: "literature",
    label: "Literature",
    screenName: "Literature",
    icon: "book",
    backgroundColor: "#FFF7ED",
    borderColor: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    id: "comics",
    label: "Comics",
    screenName: "Comics",
    icon: "color-palette",
    backgroundColor: "#FFF1F2",
    borderColor: "#FFE4E6",
    iconColor: "#E11D48",
  },
  {
    id: "others",
    label: "Others",
    screenName: "Others",
    icon: "grid",
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    iconColor: "#475569",
  },
];

const NUM_SETS = 6;
const ITEM_WIDTH_WITH_GAP = rem(4.35) + rem(0.625);
const ONE_SET_WIDTH = CATEGORIES.length * ITEM_WIDTH_WITH_GAP;
const INITIAL_SCROLL_OFFSET = ONE_SET_WIDTH * 2;

const REPEATED_CATEGORIES = Array.from({ length: NUM_SETS }).flatMap((_, setIndex) =>
  CATEGORIES.map((item) => ({
    ...item,
    uniqueKey: `${item.id}-${setIndex}`,
  }))
);

const GenreSection = memo(() => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const isInitializedRef = useRef(false);

  const handlePress = useCallback(
    (item: GenreItem) => {
      Haptics.selectionAsync();
      try {
        router.push(`/(screens)/${item.screenName}` as any);
      } catch {
        navigation.navigate("(screens)", {
          screen: item.screenName,
        });
      }
    },
    [navigation]
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isInitializedRef.current) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    if (ONE_SET_WIDTH <= 0) return;

    if (offsetX >= ONE_SET_WIDTH * 3.5) {
      scrollRef.current?.scrollTo({
        x: offsetX - ONE_SET_WIDTH * 2,
        animated: false,
      });
    } else if (offsetX <= ONE_SET_WIDTH * 0.8) {
      scrollRef.current?.scrollTo({
        x: offsetX + ONE_SET_WIDTH * 2,
        animated: false,
      });
    }
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (!isInitializedRef.current) {
      scrollRef.current?.scrollTo({
        x: INITIAL_SCROLL_OFFSET,
        animated: false,
      });
      isInitializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitializedRef.current) {
        scrollRef.current?.scrollTo({
          x: INITIAL_SCROLL_OFFSET,
          animated: false,
        });
        isInitializedRef.current = true;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentOffset={{ x: INITIAL_SCROLL_OFFSET, y: 0 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        decelerationRate="normal"
      >
        {REPEATED_CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item.uniqueKey}
            activeOpacity={0.75}
            style={styles.cardWrapper}
            onPress={() => handlePress(item)}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: item.backgroundColor,
                  borderColor: item.borderColor,
                },
              ]}
            >
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>
            <Text numberOfLines={1} style={styles.label}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

export default GenreSection;

const styles = StyleSheet.create({
  container: {
    marginTop: rem(0.625),
    marginBottom: rem(0.9375),
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: rem(0.5),
  },
  title: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg - 4,
    gap: rem(0.625),
    paddingBottom: 4,
  },
  cardWrapper: {
    alignItems: "center",
    width: rem(4.35),
  },
  iconBox: {
    width: rem(3.5),
    height: rem(3.5),
    borderRadius: rem(0.875),
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: rem(0.375),
  },
  label: {
    fontSize: rem(0.65),
    fontFamily: FONTS.manrope.bold,
    color: COLORS.text,
    textAlign: "center",
    width: "100%",
  },
});
