import { router, useNavigation } from "expo-router";
import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    icon: "sparkles",
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

const GenreSection = memo(() => {
  const navigation = useNavigation<any>();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item.id}
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
