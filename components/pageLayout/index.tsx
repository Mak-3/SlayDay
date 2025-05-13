import React, { ReactNode } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ViewStyle,
  ColorValue,
  StatusBarStyle,
} from "react-native";

interface PageProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: ColorValue;
  statusBarColor?: StatusBarStyle;
}

const PageLayout: React.FC<PageProps> = ({
  children,
  style,
  contentContainerStyle,
  backgroundColor = "#FFFFFF",
  statusBarColor = "dark-content",
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }, style]}>
      <StatusBar barStyle={statusBarColor} backgroundColor={backgroundColor} />
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
  );
};

const styles = StyleSheet.create({
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