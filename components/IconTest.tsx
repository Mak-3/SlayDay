import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { 
  FontAwesome, 
  FontAwesome5, 
  MaterialCommunityIcons, 
  MaterialIcons, 
  Feather 
} from "@expo/vector-icons";

const IconTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      
      <View style={styles.iconRow}>
        <FontAwesome name="home" size={24} color="black" />
        <Text>FontAwesome - home</Text>
      </View>
      
      <View style={styles.iconRow}>
        <FontAwesome5 name="user" size={24} color="black" />
        <Text>FontAwesome5 - user</Text>
      </View>
      
      <View style={styles.iconRow}>
        <MaterialCommunityIcons name="account" size={24} color="black" />
        <Text>MaterialCommunityIcons - account</Text>
      </View>
      
      <View style={styles.iconRow}>
        <MaterialIcons name="star" size={24} color="black" />
        <Text>MaterialIcons - star</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Feather name="heart" size={24} color="black" />
        <Text>Feather - heart</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
});

export default IconTest; 