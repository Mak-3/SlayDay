import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const goToProfile = () => {
  router.push("/profile");
};

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.menuWrapper}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={require("../../assets/images/menu.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        <Text style={styles.greeting}>SlayDay</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          goToProfile();
        }}
      >
        <Image
          source={require("../../assets/images/testUser.png")}
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
  menuWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: 'center'
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "serif",
    color: CrimsonLuxe.primary400,
    letterSpacing: 1,
  },
  username: {
    color: CrimsonLuxe.primary400,
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
