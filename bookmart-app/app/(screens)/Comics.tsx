import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import ComicsScreen from "@/screens/others/ComicsScreen";

export default function ComicsRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ComicsScreen />
    </SafeAreaView>
  );
}
