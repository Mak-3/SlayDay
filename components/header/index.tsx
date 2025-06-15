import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { getUser } from "@/db/service/UserService";

const goToProfile = () => {
  router.push("/profile");
};

const Header = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>({});

  const getProfile = async () => {
    try {
      const userInfo = await getUser();
      setUser(userInfo);
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

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
        {user.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.placeholderCircle}>
            <Text style={styles.initial}>{getInitial(user.name)}</Text>
          </View>
        )}
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
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "serif",
    color: CrimsonLuxe.primary400,
    letterSpacing: 1,
  },
  profilePicture: {
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
  placeholderCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CrimsonLuxe.primary400,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
