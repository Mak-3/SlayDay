import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_INSTALLATION_KEY = "appInstalled";

/**
 * Check if the app has been installed before
 * @returns Promise<boolean> - true if app has been installed before, false otherwise
 */
export const isAppInstalled = async (): Promise<boolean> => {
  try {
    const appInstalled = await AsyncStorage.getItem(APP_INSTALLATION_KEY);
    return appInstalled === "true";
  } catch (error) {
    console.error("Error checking app installation status:", error);
    return false;
  }
};

/**
 * Mark the app as installed
 */
export const markAppAsInstalled = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(APP_INSTALLATION_KEY, "true");
  } catch (error) {
    console.error("Error marking app as installed:", error);
  }
};

/**
 * Reset the app installation status (useful for testing)
 */
export const resetAppInstallationStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(APP_INSTALLATION_KEY);
  } catch (error) {
    console.error("Error resetting app installation status:", error);
  }
}; 