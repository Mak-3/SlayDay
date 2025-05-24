import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/backButtonHeader";
import { router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";
import PageLayout from "@/components/pageLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { getUser, saveUser } from "@/db/service/UserService";
import { getRealm } from "@/db/realm";
import { triggerBackup } from "@/constants/backupService";

const ProfileScreen = () => {
  const [jsonUploadEnabled, setJsonUploadEnabled] = useState<boolean>(false);
  const [originalPreferences, setOriginalPreferences] =
    useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      await triggerBackup();
    } catch (err) {
      console.error("Backup error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.setItem("isLoggedIn", "false");
      const realm = await getRealm();
      realm.write(() => {
        realm.deleteAll();
      });
      router.replace("/signIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getProfile = async () => {
    try {
      const userInfo = await getUser();
      setUser(userInfo);
      const prefValue = userInfo?.preferences?.jsonUploadEnabled ?? false;
      setJsonUploadEnabled(prefValue);
      setOriginalPreferences(prefValue);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await saveUser({
        userName: user.userName,
        profilePicture: user.profilePicture,
        email: user.email,
        lastOpened: new Date(),
        preferences: {
          jsonUploadEnabled: jsonUploadEnabled,
        },
      });
      setOriginalPreferences(jsonUploadEnabled);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader />
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
        <Text style={styles.name}>{user.userName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Actions</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => router.navigate("/editProfile")}
        >
          <MaterialCommunityIcons name="account-edit" size={20} />
          <Text style={styles.cardText}>Edit Profile</Text>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => router.navigate("/forgotPassword")}
        >
          <Feather name="lock" size={20} />
          <Text style={styles.cardText}>Forgot Password</Text>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={handleBackup}
          disabled={loading}
        >
          <Feather name="upload" size={20} />
          <Text style={styles.cardText}>Backup</Text>
          {loading ? (
            <ActivityIndicator size="small" color={CrimsonLuxe.primary400} />
          ) : (
            <Feather name="chevron-right" size={24} color="#aaa" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Feather name="file" size={24} color="#000" />
          <Text style={styles.cardText}>JSON uploads for checklist</Text>
          <Switch
            value={jsonUploadEnabled}
            onValueChange={(value) => setJsonUploadEnabled(value)}
          />
        </View>
      </View>

      {/* 🔽 Save button only shown if preferences changed */}
      {jsonUploadEnabled !== originalPreferences && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePreferences}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout()}
      >
        <Feather name="log-out" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 16,
    bottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  saveButton: {
    marginBottom: 16,
    backgroundColor: CrimsonLuxe.primary200,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CrimsonLuxe.primary400,
  },
  saveButtonText: {
    color: CrimsonLuxe.primary400,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
