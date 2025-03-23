import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
}

const BackButtonHeader: React.FC<HeaderProps> = ({ title }) => {
  return title ? (
    <View style={styles.headerWrapper}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.backButton}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#3B82F6",
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});

export default BackButtonHeader;
