import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Route, router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";

interface HeaderProps {
  route?: Route;
  title?: string;
  createLink?: Route;
}

const BackButtonHeader: React.FC<HeaderProps> = ({
  title,
  route,
  createLink,
}) => {
  const handleNavigation = () => {
    if (route) {
      router.push(route);
    } else if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push("/drawer/home");
    }
  };

  return title ? (
    <View style={styles.headerWrapper}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={handleNavigation} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>{title}</Text>
      </View>

      {createLink && (
        <TouchableOpacity
          onPress={() => router.push(createLink)}
          activeOpacity={0.7}
          style={styles.newButton}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <TouchableOpacity onPress={handleNavigation} activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={20} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CrimsonLuxe.primary300,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    minWidth: 70,
  },
  newButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default BackButtonHeader;