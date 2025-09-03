import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";

const FloatingMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const translateY = useSharedValue(100);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      translateY.value = withSpring(0);
    } else {
      translateY.value = withSpring(100);
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleNavigation = (route: any) => {
    setIsOpen(false);
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        {visible && (
          <Animated.View style={[styles.menu, animatedStyle]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/createChecklist")}
            >
              <FontAwesome5 name="tasks" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/createPomodoro")}
            >
              <FontAwesome5 name="hourglass-half" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/createEvent")}
            >
              <FontAwesome5 name="calendar-check" size={24} color="white" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/createNotes")}
            >
              <MaterialIcons name="notes" size={24} color="white" />
            </TouchableOpacity> */}
          </Animated.View>
        )}
        <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(!isOpen)}>
          <MaterialIcons
            name={isOpen ? "close" : "add"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 10,
    bottom: 30,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 999,
    paddingRight: 20,
    paddingBottom: 30,
    pointerEvents: "box-none",
  },
  floatingContainer: {
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CrimsonLuxe.primary400,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  menu: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "transparent",
  },
  menuItem: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 24,
    backgroundColor: CrimsonLuxe.primary300,
  },
  menuText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FloatingMenu;
