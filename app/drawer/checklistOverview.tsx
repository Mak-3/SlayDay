import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import { cardColors, CrimsonLuxe } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { getAllChecklists } from "../../db/service/ChecklistService";
import { router } from "expo-router";
import NoDataChecklist from "@/components/noDataChecklist";
import { renderIcon } from "@/components/renderIcon";

type Item = {
  title: string;
  isCompleted: boolean;
};

type Category = {
  id: string;
  name: string;
  completed: number;
  total?: number;
  category: string;
  items: Item[];
};

const checkList = () => {
  const [checklists, setChecklists] = useState<Category[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<any>({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (id: any) => {
    setExpanded((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchChecklists = async () => {
      const data = await getAllChecklists();
      const updated = data.map((cat: any) => {
        const sortedItems = cat.items.sort(
          (a: any, b: any) => Number(a.isCompleted) - Number(b.isCompleted)
        );

        const completedItems = sortedItems.filter(
          (item: any) => item.isCompleted
        ).length;

        return {
          ...cat,
          items: sortedItems,
          completed: completedItems,
        };
      });
      setChecklists(updated);
      setFilteredChecklists(updated);
    };

    fetchChecklists();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredChecklists(checklists);
      return;
    }

    const lowerText = text.toLowerCase();

    const filtered = checklists.filter(
      (category) =>
        category.name.toLowerCase().startsWith(lowerText) ||
        category.items.some((item) =>
          item.title.toLowerCase().includes(lowerText)
        )
    );

    setFilteredChecklists(filtered);
  };

  const handleNavigation = (id: string) => {
    router.replace({
      pathname: "/checklistScreen",
      params: {
        id: id,
      },
    });
  };

  if (checklists.length == 0) {
    return <NoDataChecklist />;
  }

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <BackButtonHeader title="Checklists" />
          <View
            style={[
              styles.searchContainer,
              isSearchFocused && {
                backgroundColor: CrimsonLuxe.primary100,
                borderColor: CrimsonLuxe.primary300,
              },
            ]}
          >
            <Ionicons name="search" size={20} color="red" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search checklist..."
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>

          <View style={styles.taskSection}>
            <FlatList
              data={filteredChecklists}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.category,
                    {
                      backgroundColor:
                        cardColors[index % cardColors.length].light,
                    },
                  ]}
                >
                  <View style={styles.categoryHeader}>
                    <TouchableOpacity
                      onPress={() => handleNavigation(item.id)}
                      style={styles.titleWrapper}
                    >
                      {renderIcon(
                        item.category,
                        cardColors[index % cardColors.length].dark
                      )}
                      <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleExpand(item.id)}
                      style={{ flexDirection: "row" }}
                    >
                      <Text
                        style={[
                          styles.categoryStatus,
                          { color: cardColors[index % cardColors.length].dark },
                        ]}
                      >
                        {item.completed}/{checklists[index].items.length}
                      </Text>
                      <Icon
                        name={expanded[item.id] ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={cardColors[index % cardColors.length].dark}
                      />
                    </TouchableOpacity>
                  </View>

                  {expanded[item.id] && (
                    <View style={styles.itemList}>
                      {item.items.map((task: any, index: any) => (
                        <View key={index} style={styles.itemRow}>
                          <Text
                            style={[
                              styles.itemText,
                              task.isCompleted && {
                                textDecorationLine: "line-through",
                              },
                            ]}
                          >
                            {task.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF" },
  category: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryText: { fontSize: 16, fontWeight: "bold", flex: 1 },
  categoryStatus: { fontSize: 14, color: "#7B61FF", fontWeight: "bold" },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1,
    gap: 10,
  },
  taskSection: { marginVertical: 10 },
  itemList: { marginTop: 10 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemText: { fontSize: 14, flex: 1, marginLeft: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default checkList;
