import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import PageLayout from "@/components/pageLayout";
import { Ionicons } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setEmailFocused(false);
    setPasswordFocused(false);
    setConfirmPasswordFocused(false);
  };

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      return "Strong";
    return "Normal";
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Weak":
        return "#ff4d4d";
      case "Normal":
        return "#33cc33";
      case "Strong":
        return "#009900";
      default:
        return "lightgrey";
    }
  };

  const passwordStrength = getPasswordStrength(password);
  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handleOutsideClick}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Create Account</Text>

          <View
            style={[
              styles.inputContainer,
              emailFocused && {
                backgroundColor: CrimsonLuxe.primary100,
                borderColor: CrimsonLuxe.primary300,
                borderWidth: 1,
              },
            ]}
          >
            <Icon
              name="mail-outline"
              size={20}
              color="#aaa"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={email}
              onFocus={() => {
                setPasswordFocused(false);
                setEmailFocused(true);
              }}
              onChangeText={setEmail}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              passwordFocused && {
                backgroundColor: CrimsonLuxe.primary100,
                borderColor: CrimsonLuxe.primary300,
                borderWidth: 1,
              },
            ]}
          >
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#aaa"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onFocus={() => {
                setEmailFocused(false);
                setConfirmPasswordFocused(false);
                setPasswordFocused(true);
              }}
            />
            

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>
          {passwordFocused && password.length > 0 && (
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
                            ? getStrengthColor(passwordStrength)
                            : "lightgrey",
                      },
                    ]}
                  />
                ))}
                <Text
                  style={[
                    styles.passwordStrengthText,
                    { color: getStrengthColor(passwordStrength) },
                  ]}
                >
                  {passwordStrength}
                </Text>
              </View>
            )}
          <View
            style={[
              styles.inputContainer,
              confirmPasswordFocused && {
                backgroundColor: CrimsonLuxe.primary100,
                borderColor: CrimsonLuxe.primary300,
                borderWidth: 1,
              },
            ]}
          >
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#aaa"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => {
                setEmailFocused(false);
                setPasswordFocused(false);
                setConfirmPasswordFocused(true);
              }}
            />
          </View>

          {passwordMismatch && (
            <Text style={{ color: "red", marginBottom: 10 }}>
              Passwords do not match
            </Text>
          )}

          <View style={styles.rememberMeContainer}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkbox}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={24}
                color={rememberMe ? "green" : "black"}
              />
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook-f" size={20} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Entypo name="apple" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/signIn')}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  passwordStrengthWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    marginTop: 4,
    marginBottom: 8,
  },
  passwordStrength: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  passwordStrengthText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 2,
  },
  rememberMeText: {
    color: "#333",
  },
  signUpButton: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  orText: {
    marginHorizontal: 10,
    color: "#aaa",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  footerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#aaa",
  },
  signInText: {
    color: CrimsonLuxe.primary400,
    fontWeight: "bold",
  },
});
