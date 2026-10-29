import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { BookMartLogo } from "@/constants/svgs";
import { rem, rf } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  locationName?: string;
  avatarUri?: string | null;
  fullName?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const HomeHeader: React.FC<HomeHeaderProps> = memo(
  ({
    avatarUri,
    fullName,
    notificationCount = 0,
    onNotificationPress,
    onAvatarPress,
  }) => {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        {/* Brand Logo */}
        <BookMartLogo width={rem(8.75)} height={rem(2.8125)} style={{ marginLeft: rf(-10) }} />

        {/* Right Actions */}
        <View style={styles.rightSection}>
          {/* Notification Bell */}
          <TouchableOpacity style={styles.notificationBtn} onPress={onNotificationPress} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount > 9 ? "9+" : notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Avatar with clean border */}
          <TouchableOpacity style={styles.avatarBtn} onPress={onAvatarPress} activeOpacity={0.7}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
                contentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={avatarUri}
                transition={200}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{getInitials(fullName)}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.04)",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: SPACING.md,
  },
  locIcon: {
    marginRight: SPACING.xs,
  },
  locTextContainer: {
    flex: 1,
  },
  locTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.text,
    maxWidth: "85%",
  },
  dropdownIcon: {
    marginTop: 2,
  },
  locSub: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  notificationBtn: {
    width: rem(2.25),
    height: rem(2.25),
    borderRadius: rem(1.125),
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.red,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: rem(0.5),
    fontFamily: FONTS.montserrat.bold,
    lineHeight: 12,
  },
  avatarBtn: {
    width: rem(2.25),
    height: rem(2.25),
    borderRadius: rem(1.125),
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginLeft: SPACING.xs,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  initialsContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
  },
  initialsText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
});
