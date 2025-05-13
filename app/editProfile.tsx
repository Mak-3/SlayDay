import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditProfileScreen = () => {
  const [username, setUsername] = useState("EdLarry");
  const [email] = useState("edwardlarry@email.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");

  const changeAvatar = () => {
    // Just simulating image changes by toggling between 2 sample URLs
    const newAvatar =
      avatar === "https://i.pravatar.cc/300"
        ? "https://randomuser.me/api/portraits/men/1.jpg"
        : "https://i.pravatar.cc/300";

    setAvatar(newAvatar);
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Edit Profile" />
      <View style={styles.wrapper}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon} onPress={changeAvatar}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Edward Larry</Text>
        <Text style={styles.role}>Senior Designer</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, { color: "#000" }]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 20 }]}
              value={username}
              onChangeText={setUsername}
            />
            <Icon name="check-circle" size={20} color="green" />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>
          {password.length > 0 && password.length < 8 && (
            <Text style={styles.errorText}>
              Password should contain at least 8 characters!
            </Text>
          )}

          <Text style={styles.label}>Birth Date (Optional)</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateValue}>14</Text>
            <Text style={styles.dateValue}>September</Text>
            <Text style={styles.dateValue}>1994</Text>
          </View>
        </View>
      </View>
          <View style={styles.joinedWrapper}>
            <Text style={styles.joinedText}>Joined 21 Jan 2020</Text>
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#007bff",
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
  joinedWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    marginHorizontal: 30
  },
  joinedText: {
    marginTop: 30,
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
  },
});
