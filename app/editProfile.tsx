import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut, Auth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { router } from "expo-router";

import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import { CrimsonLuxe } from "@/constants/Colors";
import { getUser, saveUser } from "@/db/service/UserService";
import { getRealm } from "@/db/realm";
import { auth, db } from "@/firebaseConfig";

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);

  const getProfile = async () => {
    try {
      const userInfo: any = await getUser();
      if (userInfo) {
        setName(userInfo.name);
        setOriginalName(userInfo.name);
        setProfilePicture(userInfo.profilePicture);
        setEmail(userInfo.email);
      }
    } catch (error) {
      console.error("Failed to get profile:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "";

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.3,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${pickerResult.assets[0].base64}`;
      setProfilePicture(base64Image);

      const userInfo: any = await getUser();
      if (userInfo) {
        await saveUser({
          ...userInfo,
          profilePicture: base64Image,
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) throw new Error("No user logged in");
              // 🔥 Delete Firestore doc
              const backupsRef = collection(db, "users", user.uid, "backup");
              const backupDocs = await getDocs(backupsRef);
              const deleteBackupPromises = backupDocs.docs.map((docSnap) =>
                deleteDoc(docSnap.ref)
              );
              await Promise.all(deleteBackupPromises);

              // Step 2: Delete user document
              const userDocRef = doc(db, "users", user.uid);
              await deleteDoc(userDocRef);
              // 🧹 Clear Realm
              const realm = await getRealm();
              realm.write(() => {
                realm.deleteAll();
              });

              // 🔓 Sign out
              await signOut(auth);
              await AsyncStorage.setItem("isLoggedIn", "false");
              router.replace("/signIn");
            } catch (err) {
              console.error("Failed to delete account:", err);
            }
          },
        },
      ]
    );
  };

  const handleSaveName = async () => {
    try {
      const userInfo: any = await getUser();
      if (!userInfo) return;
      await saveUser({
        ...userInfo,
        name: name,
      });
      setOriginalName(name);
      setShowSaveButton(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Edit Profile" />
      <View style={styles.wrapper}>
        <View style={styles.avatarContainer}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.placeholderCircle}>
              <Text style={styles.initial}>{getInitial(name)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{name}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, { color: "#000" }]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Display Name</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 20 }]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setShowSaveButton(text !== originalName);
              }}
            />
            <Icon name="check-circle" size={20} color="green" />
          </View>

          {showSaveButton && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>
            Delete Account Permanently
          </Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fefefe",
  },
  wrapper: {
    padding: 20,
    alignItems: "center",
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  placeholderCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#007bff",
    backgroundColor: CrimsonLuxe.primary400,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  role: {
    color: "#888",
    marginBottom: 25,
  },
  formContainer: {
    width: "100%",
    marginTop: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  atSymbol: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dateValue: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    marginTop: 24,
    padding: 12,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 8,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
