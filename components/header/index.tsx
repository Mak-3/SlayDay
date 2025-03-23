import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const goToProfile = () => {
  router.push("/profile")
}

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>
        {getGreeting()}, <Text style={styles.username}>ABD</Text> 👋
      </Text>
      <TouchableOpacity onPress={() => {goToProfile()}}>
        <Image
          source={require("../../assets/images/react-logo.png")}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
  },
  username: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Header;
