import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import PageLayout from "@/components/pageLayout";
import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUser } from "@/db/service/UserService";

export default function EmailVerificationScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { sendVerificationEmail, signInForVerification } = useAuth();

  useEffect(() => {
    // Get email and password from AsyncStorage (we'll store them temporarily)
    const getStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("tempSignUpEmail");
        const storedPassword = await AsyncStorage.getItem("tempSignUpPassword");
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
      } catch (error) {
        console.log("Error retrieving stored credentials:", error);
      }
    };
    getStoredCredentials();
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // First check if user is already signed in
      const auth = getAuth();
      if (!auth.currentUser) {
        // If no user is signed in, sign in with stored credentials
        await signInForVerification(email, password);
      }
      
      // Now send the verification email
      await sendVerificationEmail();
      Toast.show({
        type: "success",
        text1: "Verification email sent",
        text2: "Please check your inbox",
        position: "bottom",
      });
    } catch (error: any) {
      console.error("Resend email error:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send email",
        text2: error.message,
        position: "bottom",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmailApp = () => {
    // Try to open the default email app
    Linking.openURL("mailto:");
  };

  const handleCheckVerification = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing credentials",
        text2: "Please try signing up again",
        position: "bottom",
      });
      return;
    }

    setIsChecking(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // Clear temporary credentials
        await AsyncStorage.removeItem("tempSignUpEmail");
        await AsyncStorage.removeItem("tempSignUpPassword");
        
        // Set user as logged in
        await AsyncStorage.setItem("isLoggedIn", "true");
        
        // Save user data
        const name = email.split("@")[0];
        const profilePicture = user.photoURL ?? "";
        await saveUser({ name, email, profilePicture, lastOpened: new Date() });

        Toast.show({
          type: "success",
          text1: "Email verified successfully!",
          text2: "Welcome to SlayDay",
          position: "bottom",
        });

        setTimeout(() => {
          router.push("drawer/home" as any);
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Email not verified",
          text2: "Please check your email and click the verification link",
          position: "bottom",
        });
      }
    } catch (error: any) {
      const errorMessage = error.code === "auth/user-not-found" 
        ? "Account not found. Please sign up again."
        : error.message;
      
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: errorMessage,
        position: "bottom",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleBackToSignUp = () => {
    Alert.alert(
      "Go back to Sign Up",
      "Are you sure you want to go back? You'll need to sign up again.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Go Back", 
          style: "destructive",
          onPress: () => {
            AsyncStorage.removeItem("tempSignUpEmail");
            AsyncStorage.removeItem("tempSignUpPassword");
            router.push("signUp" as any);
          }
        }
      ]
    );
  };

  return (
    <PageLayout style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="mail-outline" size={80} color={CrimsonLuxe.primary400} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        
        <Text style={styles.subtitle}>
          We've sent a verification link to:
        </Text>
        
        <Text style={styles.emailText}>{email}</Text>

        <Text style={styles.description}>
          Please check your email and click the verification link to activate your account.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleCheckVerification}
            disabled={isChecking}
          >
            <Text style={styles.primaryButtonText}>
              {isChecking ? "Checking..." : "I've Verified My Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, isResending && styles.disabledButton]} 
            onPress={handleResendEmail}
            disabled={isResending}
          >
            <Icon name="refresh-outline" size={20} color={CrimsonLuxe.primary400} />
            <Text style={styles.secondaryButtonText}>
              {isResending ? "Sending..." : "Resend Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleOpenEmailApp}
          >
            <Icon name="open-outline" size={20} color={CrimsonLuxe.primary400} />
            <Text style={styles.secondaryButtonText}>Open Email App</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackToSignUp}
        >
          <Text style={styles.backButtonText}>Back to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: CrimsonLuxe.primary100,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: CrimsonLuxe.primary400,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CrimsonLuxe.primary300,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: CrimsonLuxe.primary400,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
}); 