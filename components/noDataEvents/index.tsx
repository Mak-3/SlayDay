import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import NoDataEventsSVG from "@/assets/svgs/NoEvents.svg";
import { router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";

export default function NotFoundScreen({selectedDate}: { selectedDate: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <NoDataEventsSVG width={"90%"} height={300} />
        <Text style={styles.title}>No Tasks</Text>
        <Text style={styles.subtitle}>
          Nothing scheduled. It's the perfect time to plan something awesome!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
                    pathname: "/createEvent",
                    params: {
                      selectedDate
                    },
                  });
          }}
          
        >
          <Text style={styles.buttonText}>Add New Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: CrimsonLuxe.primary400,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
