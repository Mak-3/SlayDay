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

    const notifications: string[] = [];

    // ✅ One-time event
    if (!repeatType) {
      if (baseDate <= new Date()) {
        return null;
      }

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
      let nextOccurrence = new Date(baseDate);

      while (nextOccurrence <= new Date()) {
        nextOccurrence.setDate(nextOccurrence.getDate() + (interval || 1));
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title}`,
          body: description || "Event reminder",
          sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
          data: { eventId, type: "event_reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: nextOccurrence,
          channelId: "default",
        },
      });
      notifications.push(notificationId);

      for (let i = 1; i < 30; i++) {
        const futureDate = new Date(nextOccurrence);
        futureDate.setDate(futureDate.getDate() + i * (interval || 1));

        const futureNotificationId =
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${title}`,
              body: description || "Event reminder",
              sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
              data: { eventId, type: "event_reminder" },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: futureDate,
              channelId: "default",
            },
          });
        notifications.push(futureNotificationId);
      }
    }

    // ✅ Weekly repeat
    else if (repeatType === "Weekly" && weekDays && weekDays.length > 0) {
      const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (const day of weekDays) {
        const weekdayIndex = weekdayMap.indexOf(day);
        if (weekdayIndex === -1) continue;

        let nextOccurrence = new Date(baseDate);
        const currentDay = nextOccurrence.getDay();
        const daysUntilTarget = (weekdayIndex - currentDay + 7) % 7;

        if (daysUntilTarget === 0 && nextOccurrence <= new Date()) {
          nextOccurrence.setDate(nextOccurrence.getDate() + 7);
        } else if (daysUntilTarget > 0) {
          nextOccurrence.setDate(nextOccurrence.getDate() + daysUntilTarget);
        }

        for (let i = 0; i < 12; i++) {
          const scheduleDate = new Date(nextOccurrence);
          scheduleDate.setDate(
            scheduleDate.getDate() + i * 7 * (interval || 1)
          );

          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `${title}`,
              body: description || "Event reminder",
              sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
              data: { eventId, type: "event_reminder" },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: scheduleDate,
              channelId: "default",
            },
          });
          notifications.push(notificationId);
        }
      }
    }

    // ✅ Monthly repeat
    else if (repeatType === "Monthly") {
      let nextOccurrence = new Date(baseDate);

      while (nextOccurrence <= new Date()) {
        nextOccurrence.setMonth(nextOccurrence.getMonth() + (interval || 1));
      }

      for (let i = 0; i < 12; i++) {
        const scheduleDate = new Date(nextOccurrence);
        scheduleDate.setMonth(scheduleDate.getMonth() + i * (interval || 1));

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${title}`,
            body: description || "Event reminder",
            sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
            data: { eventId, type: "event_reminder" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: scheduleDate,
            channelId: "default",
          },
        });
        notifications.push(notificationId);
      }
    }

    // ✅ Yearly repeat
    else if (repeatType === "Yearly") {
      let nextOccurrence = new Date(baseDate);

      while (nextOccurrence <= new Date()) {
        nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
      }

      for (let i = 0; i < 5; i++) {
        const scheduleDate = new Date(nextOccurrence);
        scheduleDate.setFullYear(scheduleDate.getFullYear() + i);

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${title}`,
            body: description || "Event reminder",
            sound: Platform.OS === "ios" ? "notification_sound.wav" : true,
            data: { eventId, type: "event_reminder" },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: scheduleDate,
            channelId: "default",
          },
        });
        notifications.push(notificationId);
      }
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
