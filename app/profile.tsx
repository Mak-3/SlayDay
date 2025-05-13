import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/backButtonHeader";
import { router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";
import PageLayout from "@/components/pageLayout";

import { getChecklistCount } from "@/db/service/ChecklistService";
import { getPomodoroCount } from "@/db/service/PomodoroService";
import { getEventCount } from "@/db/service/EventService";

const ProfileScreen = () => {
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const checklistCount = await getChecklistCount();
      const pomodoroCount = await getPomodoroCount();
      const eventCount = await getEventCount();

      setChecklistCount(checklistCount.total);
      setPomodoroCount(pomodoroCount.total);
      setEventCount(eventCount.total);
    };

    fetchCounts();
  }, []);

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader />
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Coffeestories</Text>
        <Text style={styles.email}>mark.brock@icloud.com</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => {
            router.push("/editProfile");
          }}
        >
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>History</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => router.navigate("/checklistOverview")}
        >
          <FontAwesome5 name="tasks" size={20} />
          <Text style={styles.cardText}>Checklists</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{checklistCount}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => router.navigate("/pomodoroStatistics")}
        >
          <FontAwesome5 name="hourglass-half" size={20} />
          <Text style={styles.cardText}>Pomodoro</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pomodoroCount}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardRow}
          onPress={() => router.navigate("/calender")}
        >
          <FontAwesome5 name="calendar-check" size={20} />
          <Text style={styles.cardText}>Events</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{eventCount}</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Feather name="bell" size={24} color="#000" />
          <Text style={styles.cardText}>Push notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(value) => setPushNotifications(value)}
          />
        </View>
        <View style={styles.cardRow}>
          <Feather name="smile" size={24} color="#000" />
          <Text style={styles.cardText}>Face ID</Text>
          <Switch
            value={faceID}
            onValueChange={(value) => setFaceID(value)}
          />
        </View>
        <TouchableOpacity style={styles.cardRow}>
          <Feather name="lock" size={24} color="#000" />
          <Text style={styles.cardText}>PIN Code</Text>
          <Feather name="chevron-right" size={24} color="#aaa" />
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity style={styles.logoutButton}>
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
  editProfileButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editProfileText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
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
  badge: {
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: {
    position: 'absolute',
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 16,
    bottom: 30
  },
  logoutText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ProfileScreen;