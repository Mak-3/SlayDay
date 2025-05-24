import { Ionicons } from "@expo/vector-icons";
import { Route, router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  route?: Route;
  title?: string;
}

const BackButtonHeader: React.FC<HeaderProps> = ({ title, route }) => {
  const handleNavigation = () => {
    if(route){
      router.push(route);
    }
    if (router.canGoBack?.()) {
      router.back();
    }
    else{
      router.push('/drawer/home')
    }
  }

  return title ? (
    <View style={styles.headerWrapper}>
      <TouchableOpacity onPress={() => handleNavigation()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  ) : (
    <TouchableOpacity onPress={() => handleNavigation()} activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={20} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
