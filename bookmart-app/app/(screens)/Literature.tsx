import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import LiteratureScreen from "@/screens/others/LiteratureScreen";

export default function LiteratureRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LiteratureScreen />
    </SafeAreaView>
  );
}
