import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/pageLayout";
import Sunrise from "@/components/checkListTemplates/Sunrise";
import { useLocalSearchParams } from "expo-router";
import { getChecklistById } from "@/db/service/ChecklistService";

const ChecklistScreen = () => {
  const { id } = useLocalSearchParams();
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getChecklistById(id as string);
        setChecklist(data);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchChecklist();
    }
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <ActivityIndicator size="large" />
      </PageLayout>
    );
  }

  if (!checklist) {
    return (
      <PageLayout>
        <Text style={styles.errorText}>Checklist not found.</Text>
      </PageLayout>
    );
  }

  return (
    <Sunrise checklistData={checklist}/>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({
  errorText: {
    padding: 20,
    fontSize: 16,
    color: "red",
  },
});