import { COLORS } from "@/constants/colors";
import { rem } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    width: "74%",
    height: rem(3.6),
    backgroundColor: COLORS.white,
    borderRadius: rem(1.8),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,

    // Soft floating shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 128, 128, 0.08)",
  },
  slidingPill: {
    position: "absolute",
    top: rem(0.35),
    bottom: rem(0.35),
    backgroundColor: "rgba(0, 128, 128, 0.12)", // Translucent liquid bubble
    borderRadius: rem(1.5),
    borderWidth: 1.2,
    borderColor: "rgba(0, 128, 128, 0.18)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: rem(3.0),
    height: rem(2.8),
  },
});
