import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import PageLayout from "@/components/pageLayout";
import CustomTextInput from "@/components/textInput";
import { CrimsonLuxe } from "@/constants/Colors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Email is required" });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({ type: "success", text1: "Reset email sent!" });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Something went wrong",
      });
    }
  };

  return (
  <PageLayout style={styles.container} contentContainerStyle={{justifyContent: 'center'}}>
    <View style={styles.formContainer}>
      <View style={styles.centered}>
        <Image source={require('../assets/images/splash-icon.png')} style={{ width: 120, height: 120, marginBottom: 40 }} />
        <Text style={styles.title}>Forgot Password</Text>
      </View>

      <CustomTextInput
        style={styles.input}
        name="email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.signUpButtonText}>Send Reset Link</Text>
      </TouchableOpacity>
    </View>
  </PageLayout>
);

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    paddingHorizontal: 20,
  },
  centered: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    width: "100%",
  },
  signUpButton: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 30,
    width: "100%",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
