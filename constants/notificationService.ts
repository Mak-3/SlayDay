import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { CrimsonLuxe } from "./Colors";

// Create notification channel for Android
const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: CrimsonLuxe.primary400,
      sound: "notification_sound.wav", // This is the key part for custom sound
    });
  }
};

// Initialize notification channel
createNotificationChannel();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  return true;
};

// Schedule a notification for an event
export const scheduleEventNotification = async (
  eventId: string,
  title: string,
  description: string,
  date: Date,
  time: Date,
  repeatType?: "Daily" | "Weekly" | "Monthly" | "Yearly",
  interval?: number,
  weekDays?: string[]
) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const baseDate = new Date(date);
    baseDate.setHours(time.getHours());
    baseDate.setMinutes(time.getMinutes());
    baseDate.setSeconds(0);

    if (baseDate <= new Date()) {
      return null;
    }

    const notifications: string[] = [];

    // ✅ One-time event
    if (!repeatType) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title}`,
          body: description || "Event reminder",
          sound: Platform.OS === "ios" ? "notification_sound.wav" : true, // iOS uses filename, Android uses boolean
          data: { eventId, type: "event_reminder" },
          priority: "HIGH",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: baseDate,
          channelId: "default",
        },
      });
      notifications.push(notificationId);
    }

    // ✅ Daily repeat
    else if (repeatType === "Daily") {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title}`,
          body: description || "Event reminder",
          sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
          data: { eventId, type: "event_reminder" },
        },
        trigger: {
          hour: baseDate.getHours(),
          minute: baseDate.getMinutes(),
          repeats: true,
          channelId: "default",
        },
      });
      notifications.push(notificationId);
    }

    // ✅ Weekly repeat
    else if (repeatType === "Weekly" && weekDays && weekDays.length > 0) {
      for (const day of weekDays) {
        const weekdayIndex = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].indexOf(day);
        if (weekdayIndex === -1) continue;

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${title}`,
            body: description || "Event reminder",
            sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
            data: { eventId, type: "event_reminder" },
          },
          trigger: {
            weekday: weekdayIndex + 1, // Sunday = 1, Monday = 2, ...
            hour: baseDate.getHours(),
            minute: baseDate.getMinutes(),
            repeats: true,
            channelId: "default",
          },
        });
        notifications.push(notificationId);
      }
    }

    // ✅ Monthly repeat
    else if (repeatType === "Monthly") {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title}`,
          body: description || "Event reminder",
          sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
          data: { eventId, type: "event_reminder" },
        },
        trigger: {
          day: baseDate.getDate(),
          hour: baseDate.getHours(),
          minute: baseDate.getMinutes(),
          repeats: true,
          channelId: "default",
        },
      });
      notifications.push(notificationId);
    }

    // ✅ Yearly repeat
    else if (repeatType === "Yearly") {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title}`,
          body: description || "Event reminder",
          sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
          data: { eventId, type: "event_reminder" },
        },
        trigger: {
          month: baseDate.getMonth() + 1,
          day: baseDate.getDate(),
          hour: baseDate.getHours(),
          minute: baseDate.getMinutes(),
          repeats: true,
          channelId: "default",
        },
      });
      notifications.push(notificationId);
    }

    return notifications;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

// Cancel a scheduled notification
export const cancelEventNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return true;
  } catch (error) {
    return false;
  }
};

// Cancel all notifications for a specific event
export const cancelAllEventNotifications = async (eventId: string) => {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const eventNotifications = scheduledNotifications.filter(
      (notification) => notification.content.data?.eventId === eventId
    );

    for (const notification of eventNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }

    return true;
  } catch (error) {
    console.error("Error cancelling event notifications:", error);
    return false;
  }
};

// Get all scheduled notifications
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
};

// Clear all notifications
export const clearAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    return false;
  }
};
