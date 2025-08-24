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
import { getUser, saveUser } from "@/db/service/UserService";
import { triggerBackup } from "@/constants/backupService";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../context/AuthContext";

const exampleJson = `{
  "tasks": [
    {
      "title": "Buy groceries",
      "isCompleted": false,
      "deadline": "2025-05-17T00:00:00Z"
    },
    {
      "title": "Finish report",
      "isCompleted": true
    }
  ]
}`;

const ProfileScreen = () => {
  const [jsonUploadEnabled, setJsonUploadEnabled] = useState<boolean>(false);
  const [originalJSONUploadPref, setOriginalJSONUploadPref] =
    useState<boolean>(false);
  const [originalAutomaticBackupEnabled, setOriginalAutomaticBackupEnabled] =
    useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showJsonExample, setShowJsonExample] = useState(false);
  const [automaticBackupEnabled, setAutomaticBackupEnabled] =
    useState<boolean>(false);
  const { signOut } = useAuth();

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
      await signOut();
    } catch (error) {
      console.error("Error during logouter:", error);
    }
  };

  const getProfile = async () => {
    try {
      const userInfo = await getUser();
      setUser(userInfo);
      const prefs = userInfo?.preferences as any;
      const jsonPref = prefs.jsonUploadEnabled ?? false;
      const autoBackupPref = prefs.automaticBackupEnabled ?? false;
      setJsonUploadEnabled(jsonPref);
      setAutomaticBackupEnabled(autoBackupPref);

      setOriginalJSONUploadPref(jsonPref);
      setOriginalAutomaticBackupEnabled(autoBackupPref);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await saveUser({
        ...user,
        lastOpened: new Date(),
        preferences: {
          jsonUploadEnabled,
          automaticBackupEnabled,
        },
      });
      setOriginalJSONUploadPref(jsonUploadEnabled);
      setOriginalAutomaticBackupEnabled(automaticBackupEnabled);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <PageLayout
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <BackButtonHeader />
      <View style={styles.profileContainer}>
        {user.profilePicture ? (
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.placeholderCircle}>
            <Text style={styles.initial}>{getInitial(user.name)}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
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
          <Text style={styles.cardText}>Trigger Backup</Text>
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
          <Text style={styles.cardText}>Enable file upload for tasks</Text>
          <Switch
            value={jsonUploadEnabled}
            onValueChange={(value) => setJsonUploadEnabled(value)}
          />
        </View>
        <View style={styles.expandSection}>
          <TouchableOpacity style={styles.expandToggle}>
            <Text style={styles.toggleText}>Accepted File Format</Text>

            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Feather
                name={showJsonExample ? "chevron-up" : "chevron-down"}
                size={20}
                color="#333"
                onPress={() => setShowJsonExample(!showJsonExample)}
              />
              <Feather
                name="copy"
                size={16}
                color="#333"
                onPress={() => Clipboard.setStringAsync(exampleJson)}
              />
            </View>
          </TouchableOpacity>

          {showJsonExample && (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleText}>{exampleJson}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="cloud-upload-outline" size={24} />
          <Text style={styles.cardText}>Allow Automatic Backup</Text>
          <Switch
            value={automaticBackupEnabled}
            onValueChange={setAutomaticBackupEnabled}
          />
        </View>
      </View>

      {(jsonUploadEnabled !== originalJSONUploadPref ||
        automaticBackupEnabled !== originalAutomaticBackupEnabled) && (
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
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  placeholderCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: CrimsonLuxe.primary400,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
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
  expandSection: {
    marginTop: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    overflow: "hidden",
  },

  expandToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e0e0e0",
  },

  toggleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },

  exampleBox: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },

  exampleText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#444",
  },

  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CrimsonLuxe.primary400,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  copyText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
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
    bottom: 10,
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
