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
import AntDesign from "react-native-vector-icons/AntDesign";
import PageLayout from "@/components/pageLayout";
import { Ionicons } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import Toast from "react-native-toast-message";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { saveUser } from "@/db/service/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Passwords do not match",
        position: "bottom",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userName = email.split("@")[0];

      await AsyncStorage.setItem("isLoggedIn", "true");
      // Save to Realm
      await saveUser({
        userName,
        email,
        lastOpened: new Date(),
        profilePicture: "",
      });

      setPasswordMismatch(false);
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "Redirecting to home...",
        position: "bottom",
      });

      setTimeout(() => {
        router.replace("/drawer/home");
      }, 1500);
    } catch (error: any) {
      const toastConfig = {
        "auth/email-already-in-use": {
          type: "error",
          text1: "Email already in use",
          text2: "Try a different email address or Sign In",
        },
        "auth/invalid-email": {
          type: "error",
          text1: "Invalid Email",
          text2: "Please enter a valid email address",
        },
        "auth/weak-password": {
          type: "error",
          text1: "Weak Password",
          text2: "Password should be at least 6 characters",
        },
        default: {
          type: "error",
          text1: "Signup failed",
          text2: "Please try again later",
        },
      } as any;

      const { type, text1, text2 } =
        toastConfig[error.code] || toastConfig.default;
      Toast.show({ type, text1, text2, position: "bottom" });
    }
  };

  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "809634720109-1rnvdhue6agfn6k6fugbd6hkfc48sgj5.apps.googleusercontent.com",
    webClientId:
      "809634720109-ecv3b8jrv8k9qls86ga3h2mouofiu8ka.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.params;
          const auth = getAuth();
          const credential = GoogleAuthProvider.credential(id_token);

          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          const email = user.email ?? "";
          const userName = email.split("@")[0];
          const profilePicture = user.photoURL ?? "";

          await AsyncStorage.setItem("isLoggedIn", "true");

          await saveUser({
            userName,
            email,
            profilePicture,
            lastOpened: new Date(),
          });

          Toast.show({
            type: "success",
            text1: "Google Sign-in Success",
            text2: "Redirecting...",
            position: "bottom",
          });

          router.replace("/drawer/home");
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: "Google Sign-in Failed",
            text2: error.message,
            position: "bottom",
          });
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

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
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => promptAsync()}
            >
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/signIn")}>
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
    textAlign: "center",
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
    justifyContent: "flex-end",
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
    flexDirection: "row",
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
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
