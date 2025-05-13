import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import NoDataChecklistSVG from "@/assets/svgs/NoChecklist.svg";
import PageLayout from "../pageLayout";
import BackButtonHeader from "../backButtonHeader";
import { router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";

export default function NotFoundScreen() {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Checklists" />
      <View style={styles.card}>
        <NoDataChecklistSVG width={"100%"} height={350} />
        <Text style={styles.title}>No checklists yet</Text>
        <Text style={styles.subtitle}>
          All clear! Ready to build a plan and make things happen?
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/createChecklist")}
        >
          <Text style={styles.buttonText}>Create New Checklist</Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
