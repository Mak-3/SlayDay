import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { CrimsonLuxe } from "@/constants/Colors";
import productivityQuotes from "@/constants/quotes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import PageLayout from "@/components/pageLayout";

const { width } = Dimensions.get("window");

export default function QuoteCardOverlay() {
  const [cardHeight, setCardHeight] = useState(0);

  const getQuoteOfTheDay = () => {
    const startDate = new Date("2025-01-01");
    const today = new Date();
    const daysSinceStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = daysSinceStart % productivityQuotes.length;
    return productivityQuotes[index];
  };

  const quote = getQuoteOfTheDay();

  const handleClose = () => {
    router.navigate("/home");
  };

  return (
    <PageLayout style={styles.safeArea} statusBarColor="light-content">
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </Pressable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome back</Text>
        </View>

        <View style={styles.cardWrapper}>
          <View style={[styles.shadowCard, { height: cardHeight }]} />

          <View
            style={styles.card}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setCardHeight(height);
            }}
          >
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quoteText}>{quote}</Text>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CrimsonLuxe.primary400,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CrimsonLuxe.primary400,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  header: {
    marginBottom: 40,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  cardWrapper: {
    width: width * 0.8,
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowCard: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#f7f2f5",
    borderRadius: 24,
    transform: [{ rotate: "-5deg" }],
    zIndex: 0,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 1,
    paddingVertical: 60,
  },
  quoteMark: {
    fontSize: 48,
    color: CrimsonLuxe.primary400,
  },
  quoteText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    lineHeight: 44,
  },
});
