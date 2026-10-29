import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface NearestBook {
  id: string;
  title: string;
  latitude?: number;
  longitude?: number;
}

interface MapMarkerProps {
  book: NearestBook;
  isSelected: boolean;
  hasSelection: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({ isSelected, hasSelection }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          isSelected && styles.bubbleSelected,
          hasSelection && !isSelected && styles.bubbleDimmed,
        ]}
      >
        <Ionicons name="book" size={isSelected ? 16 : 13} color={COLORS.white} />
      </View>
      {isSelected && <View style={styles.pinTip} />}
    </View>
  );
};

export default React.memo(MapMarker);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  bubbleSelected: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    borderColor: "#E0F2FE",
    borderWidth: 3,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    transform: [{ scale: 1.1 }],
  },
  bubbleDimmed: {
    opacity: 0.65,
    transform: [{ scale: 0.9 }],
  },
  pinTip: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 0,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
    marginTop: -2,
  },
});
