import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import OthersScreen from "@/screens/others/OthersScreen";

export default function OthersRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OthersScreen />
    </SafeAreaView>
  );
}
