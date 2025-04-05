import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import PageLayout from "@/components/pageLayout";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PageLayout style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Create your{"\n"}Account</Text>

      <View style={styles.inputContainer}>
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
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
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

      <TouchableOpacity style={styles.signUpButton}>
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
        <TouchableOpacity>
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>
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
    marginRight: 10
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: "#D96C6C",
    borderRadius: 2,
  },
  rememberMeText: {
    color: "#333",
  },
  signUpButton: {
    backgroundColor: "#D96C6C",
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
    color: "#D96C6C",
    fontWeight: "bold",
  },
});
