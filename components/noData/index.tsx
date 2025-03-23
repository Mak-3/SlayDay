import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BackButtonHeader from "../backButtonHeader";
import PageLayout from "../pageLayout";

interface NoDataProps {
  onPress: () => void;
}

const NoData: React.FC<NoDataProps> = ({ onPress }) => {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader />
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>
          Get ready to{"\n"}
          <Text style={styles.highlightText}>supercharge</Text>
          {"\n"}
          your goal-setting and{"\n"}
          planning with AI Planner.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F18F2A",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headingText: {
    fontSize: 40,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "400",
    lineHeight: 60,
    letterSpacing: 0.5,
  },
  highlightText: {
    fontWeight: "600",
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NoData;
