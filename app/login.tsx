import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/button";
import DividerWithText from "@/components/dividerWithText";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) return "Strong";
    return "Normal"
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "#ff4d4d";
      case "Normal":
        return "#33cc33";
      case "Strong":
        return "#009900";
      default:
        return "grey";
    }
  };

  return (
    <LinearGradient
      colors={["#ffb75e", "#ed8f03"]}
      start={[1, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <View style={styles.logoBlock}>
        <Text style={styles.brandName}>Habitus</Text>
      </View>
      <View style={styles.dummyContainer}></View>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineStyle={{ borderRadius: 10 }}
          activeOutlineColor="#ffb75e"
        />
        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onFocus={() => setIsPasswordFocused(true)}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          outlineStyle={{ borderRadius: 10 }}
          activeOutlineColor="#ffb75e"
          right={
            isPasswordFocused && <TextInput.Icon
              style={{ width: 100, right: 25 }}
              icon={() => (
                <View style={styles.passwordStrengthWrapper}>
                  {[...Array(3)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.passwordStrength,
                        {
                          backgroundColor:
                            index <
                            (passwordStrength === "Weak"
                              ? 1
                              : passwordStrength === "Normal"
                              ? 2
                              : 3)
                              ? getStrengthColor()
                              : "lightgrey",
                        },
                      ]}
                    />
                  ))}
                  <Text
                    style={[
                      styles.passwordStrengthText,
                      { color: getStrengthColor() },
                    ]}
                  >
                    {passwordStrength}
                  </Text>
                </View>
              )}
            />
          }
        />

        <Button
          title="Login"
          onPress={() => console.log("Logging in...")}
          buttonType="primary"
          style={styles.button}
        />
        <DividerWithText text="Or login with" />
        <Button
          title="Google"
          onPress={() => console.log("Logging in...")}
          buttonType="secondary"
          style={styles.button}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoBlock: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  innerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
    paddingHorizontal: 24,
    backgroundColor: "white",
    justifyContent: "center",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  dummyContainer: {
    position: "absolute",
    bottom: 15,
    left: '5%',
    width: "90%",
    height: "70%",
    backgroundColor: "#ffb75e",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "black",
  },
  input: {
    marginBottom: 16,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  passwordStrengthWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordStrength: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  passwordStrengthText: {
    marginHorizontal: 4,
    fontSize: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
