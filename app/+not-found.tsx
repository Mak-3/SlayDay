import { StyleSheet } from "react-native";
import React from "react";
import { Image } from "react-native";
import PageLayout from "@/components/pageLayout";

export default function NotFoundScreen() {
  return (
    <PageLayout contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={{ width: 120, height: 120, }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
