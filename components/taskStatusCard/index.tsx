import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";

const TaskCard = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleDescription = () => {
    setExpanded((prev) => !prev);
  };

  const longDescription =
    "This is a very detailed description of the Product Design Task Management app which might go longer than expected, and hence needs to be collapsible after 3 lines. It includes goals, time, stakeholders, deliverables, and timelines.";

  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="clock" size={28} color={CrimsonLuxe.primary400} />
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.title}>Product Design Task Management app</Text>

        <TouchableOpacity onPress={handleToggleDescription}>
          <Text
            style={styles.description}
            numberOfLines={expanded ? undefined : 2}
            ellipsizeMode="tail"
          >
            {longDescription}
          </Text>
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#888"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.timeText}>10:00 AM - 12:30 PM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginVertical: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CrimsonLuxe.primary100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#888",
  },
});

export default TaskCard;