import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import FictionScreen from "@/screens/others/FictionScreen";

export default function FictionRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FictionScreen />
    </SafeAreaView>
  );
}
