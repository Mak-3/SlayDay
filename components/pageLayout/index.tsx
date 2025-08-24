import React, { ReactNode, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ViewStyle,
  StatusBarStyle,
  View,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: any;
  statusBarColor?: StatusBarStyle;
}

const PageLayout: React.FC<PageProps> = ({
  children,
  style,
  contentContainerStyle,
  backgroundColor = "#FFFFFF",
  statusBarColor = "dark-content",
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(backgroundColor);
      NavigationBar.setButtonStyleAsync(
        statusBarColor === "dark-content" ? "dark" : "light"
      );
    }
  }, [backgroundColor, statusBarColor]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={statusBarColor} 
        backgroundColor={backgroundColor}
        translucent={true}
      />
      <SafeAreaView 
        style={[
          styles.safeArea, 
          { 
            backgroundColor,
            paddingTop: Platform.OS === "android" ? insets.top : 0,
            paddingBottom: Platform.OS === "android" ? insets.bottom : 0,
          }, 
          style
        ]}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollViewContent,
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
});

export default PageLayout;
