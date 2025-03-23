import React from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  buttonType?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ title, onPress, buttonType = "primary", style, textStyle }) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.2)", borderless: false }}
      style={({ pressed }) => [
        styles.button,
        buttonVariants[buttonType],
        style,
        pressed && Platform.OS === "ios" && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.text, textVariants[buttonType], textStyle]}>{title}</Text>
    </Pressable>
  );
};

const buttonVariants = StyleSheet.create({
  primary: {
    backgroundColor: "#ffb75e",
  },
  secondary: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ffb75e",
  },
});

const textVariants = StyleSheet.create({
  primary: {
    color: "#FFF",
  },
  secondary: {
    color: "#ffb75e",
  },
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Button;
