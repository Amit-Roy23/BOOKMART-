import { router, useNavigation } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/clients";

interface GenreTheme {
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
}

const GENRE_THEMES: Record<string, GenreTheme> = {
  romance: {
    icon: "heart",
    backgroundColor: "#FFF1F2",
    borderColor: "#FFE4E6",
    iconColor: "#E11D48",
  },
  "self help": {
    icon: "leaf",
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
    iconColor: "#059669",
  },
  "science fiction": {
    icon: "rocket",
    backgroundColor: "#EEF2FF",
    borderColor: "#E0E7FF",
    iconColor: "#4F46E5",
  },
  biography: {
    icon: "finger-print",
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
    iconColor: "#D97706",
  },
  business: {
    icon: "briefcase",
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  engineering: {
    icon: "hardware-chip",
    backgroundColor: "#F0FDFA",
    borderColor: "#CCFBF1",
    iconColor: "#0D9488",
  },
  medical: {
    icon: "medkit",
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
    iconColor: "#DC2626",
  },
  law: {
    icon: "scale",
    backgroundColor: "#F5F3FF",
    borderColor: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  "competitive exams": {
    icon: "trophy",
    backgroundColor: "#FFFBEB",
    borderColor: "#FEF3C7",
    iconColor: "#B45309",
  },
  "non fiction": {
    icon: "book",
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    iconColor: "#475569",
  },
};

const getGenreTheme = (label: string): GenreTheme => {
  const norm = label.toLowerCase().trim();
  if (norm.includes("romance") || norm.includes("love")) {
    return GENRE_THEMES.romance;
  }
  if (
    norm.includes("self help") ||
    norm.includes("self-help") ||
    norm.includes("happiness") ||
    norm.includes("ikigai") ||
    norm.includes("longevity") ||
    norm.includes("quality of life") ||
    norm.includes("psychology")
  ) {
    return GENRE_THEMES["self help"];
  }
  if (norm.includes("science") || norm.includes("sci-fi") || norm.includes("fiction")) {
    return GENRE_THEMES["science fiction"];
  }
  if (norm.includes("biography") || norm.includes("memoir") || norm.includes("autobiography")) {
    return GENRE_THEMES.biography;
  }
  if (norm.includes("business") || norm.includes("finance") || norm.includes("money") || norm.includes("economics")) {
    return GENRE_THEMES.business;
  }
  if (norm.includes("engineering") || norm.includes("tech") || norm.includes("code") || norm.includes("computer")) {
    return GENRE_THEMES.engineering;
  }
  if (norm.includes("medical") || norm.includes("health") || norm.includes("medicine")) {
    return GENRE_THEMES.medical;
  }
  if (norm.includes("law") || norm.includes("legal") || norm.includes("justice")) {
    return GENRE_THEMES.law;
  }
  if (
    norm.includes("competitive") ||
    norm.includes("exam") ||
    norm.includes("test") ||
    norm.includes("upsc") ||
    norm.includes("jee") ||
    norm.includes("neet")
  ) {
    return GENRE_THEMES["competitive exams"];
  }
  if (norm.includes("non fiction") || norm.includes("non-fiction")) {
    return GENRE_THEMES["non fiction"];
  }

  const fallbacks: GenreTheme[] = [
    { icon: "book", backgroundColor: "#F0FDFA", borderColor: "#CCFBF1", iconColor: "#0D9488" },
    { icon: "bookmarks", backgroundColor: "#EFF6FF", borderColor: "#DBEAFE", iconColor: "#2563EB" },
    { icon: "sparkles", backgroundColor: "#FDF4FF", borderColor: "#FAE8FF", iconColor: "#C026D3" },
    { icon: "library", backgroundColor: "#FFF7ED", borderColor: "#FFEDD5", iconColor: "#EA580C" },
    { icon: "globe-outline", backgroundColor: "#ECFEFF", borderColor: "#CFFAFE", iconColor: "#0891B2" },
  ];
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = (hash + norm.charCodeAt(i)) % fallbacks.length;
  }
  return fallbacks[hash];
};

interface GenreItem {
  id: string;
  label: string;
  screenName: string;
}

const CURATED_GENRES: GenreItem[] = [
  { id: "romance", label: "Romance", screenName: "Romance" },
  { id: "self-help", label: "Self Help", screenName: "SelfHelp" },
  { id: "sci-fi", label: "Sci-Fi", screenName: "ScienceFiction" },
  { id: "business", label: "Business", screenName: "Business" },
  { id: "engineering", label: "Engineering", screenName: "Engineering" },
  { id: "medical", label: "Medical", screenName: "Medical" },
  { id: "law", label: "Law", screenName: "Law" },
  { id: "competitive-exams", label: "Competitive Exams", screenName: "CompetitiveExams" },
  { id: "biography", label: "Biography", screenName: "Biography" },
];

const GenreSection = memo(() => {
  const navigation = useNavigation<any>();

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.get("/api/v1/book/genres/");
      return response.data;
    },
  });

  const genres: GenreItem[] = useMemo(() => {
    if (!genresData?.results || genresData.results.length === 0) {
      return CURATED_GENRES;
    }

    const apiGenres = genresData.results.map((g: any): GenreItem => {
      let screenName = "ScienceFiction";
      const nameLower = g.name.toLowerCase();
      if (nameLower.includes("romance")) screenName = "Romance";
      else if (nameLower.includes("self help") || nameLower.includes("ikigai") || nameLower.includes("happiness")) screenName = "SelfHelp";
      else if (nameLower.includes("biography")) screenName = "Biography";
      else if (nameLower.includes("business")) screenName = "Business";
      else if (nameLower.includes("engineering")) screenName = "Engineering";
      else if (nameLower.includes("medical")) screenName = "Medical";
      else if (nameLower.includes("law")) screenName = "Law";
      else if (nameLower.includes("competitive exams") || nameLower.includes("exam")) screenName = "CompetitiveExams";

      return {
        id: String(g.id),
        label: g.name,
        screenName,
      };
    });

    const existingLabels = new Set(apiGenres.map((item: GenreItem) => item.label.toLowerCase()));
    const missingCurated = CURATED_GENRES.filter(
      (curated) => !existingLabels.has(curated.label.toLowerCase())
    );

    return [...CURATED_GENRES];
  }, [genresData]);

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
        <Text style={styles.title}>Explore Genres</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {genres.map((item) => {
          const theme = getGenreTheme(item.label);
          return (
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
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <Ionicons name={theme.icon} size={22} color={theme.iconColor} />
              </View>
              <Text numberOfLines={1} style={styles.label}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
