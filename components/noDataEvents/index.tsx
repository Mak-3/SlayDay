import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import NoDataEventsSVG from "@/assets/svgs/NoEvents.svg"; // replace with your actual events SVG
import PageLayout from "../pageLayout";
import BackButtonHeader from "../backButtonHeader";
import { CrimsonLuxe } from "@/constants/Colors";

export default function NoDataEvents() {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Events & Reminders" />
      <View style={styles.card}>
        <NoDataEventsSVG width={"100%"} height={300} />

        <Text style={styles.title}>No events found</Text>
        <Text style={styles.subtitle}>
          Looks like you haven’t planned anything yet. 
          Start by creating your first event!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/createEvent")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create New Event</Text>
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
    color: "#444",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
