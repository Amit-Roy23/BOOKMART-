import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AcademicScreen from "@/screens/others/AcademicScreen";

export default function AcademicRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AcademicScreen />
    </SafeAreaView>
  );
}
