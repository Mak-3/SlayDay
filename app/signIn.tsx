import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import PageLayout from "@/components/pageLayout";
import { Ionicons } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { saveUser } from "@/db/service/UserService";

import { getRealm } from "@/db/realm";
import restoreRealmData from "@/constants/restoreBackupFromFirebase";
import { downloadBackup } from "@/constants/backupService";
import { useAuth } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { signIn } = useAuth();

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setEmailFocused(false);
    setPasswordFocused(false);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "809634720109-1rnvdhue6agfn6k6fugbd6hkfc48sgj5.apps.googleusercontent.com",
    webClientId:
      "809634720109-ecv3b8jrv8k9qls86ga3h2mouofiu8ka.apps.googleusercontent.com",
  });

  const fetchBackup = async (userId: any) => {
    const realm = await getRealm();

    try {
      const backupData: any = await downloadBackup(userId);

      await restoreRealmData(realm, backupData);
    } catch (error) {}
  };

  React.useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);

          // First check if the user exists
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          // Check if this is a new user by looking at metadata
          const isNewUser =
            user.metadata.creationTime === user.metadata.lastSignInTime;

          if (isNewUser) {
            // Sign out the user since they don't have an account
            await auth.signOut();
            Toast.show({
              type: "error",
              text1: "Account Not Found",
              text2: "Please sign up first to create an account",
              position: "bottom",
            });
            return;
          }

          const email = user.email ?? "";
          const name = email.split("@")[0];
          const profilePicture = user.photoURL ?? "";
          await AsyncStorage.setItem("isLoggedIn", "true");
          fetchBackup(user.uid);
          await saveUser({
            name,
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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }
    try {
      await signIn(email, password);
      router.replace("/drawer/home");
    } catch (error: any) {
      const toastConfig = {
        "auth/invalid-credential": {
          type: "error",
          text1: "Invalid Email or password",
          text2: "Please check your email and password",
        },
        default: {
          type: "error",
          text1: "Signin failed",
          text2: "Please try again later",
        },
      } as any;
      const { type, text1, text2 } =
        toastConfig[error.code] || toastConfig.default;
      Toast.show({ type, text1, text2, position: "bottom" });
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Welcome Back</Text>

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

          <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
            <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
              <Text
                style={{ color: CrimsonLuxe.primary400, fontWeight: "500" }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignIn}>
            <Text style={styles.signUpButtonText}>Sign in</Text>
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
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/signUp")}>
              <Text style={styles.signInText}>Sign up</Text>
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
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
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
    flexDirection: "row",
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
