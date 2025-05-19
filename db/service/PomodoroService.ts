import { getRealm } from "../realm";
import { ObjectId } from "bson";

function getISOWeek(date: Date): number {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

export const createPomodoro = async ({
  title,
  taskType,
  time,
  category,
  createdAt,
  endAt,
}: {
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: Date;
  endAt: Date;
}) => {
  const realm = await getRealm();
  try {
    realm.write(() => {
      realm.create("Pomodoro", {
        _id: new ObjectId(),
        title,
        taskType,
        time,
        category,
        createdAt,
        endAt,
      });
    });
  } finally {
  }
};

export const getAllPomodoros = async () => {
  const realm = await getRealm();
  const pomodoros = realm.objects("Pomodoro").sorted("createdAt", true);

  const normalized = pomodoros.map((item: any) => ({
    id: item._id,
    title: item.title,
    taskType: item.taskType,
    time: item.time,
    category: item.category,
    createdAt: item.createdAt,
    endAt: item.endAt,
  }));

  return normalized;
};

export const updatePomodoro = async (
  id: ObjectId,
  updates: Partial<{
    title: string;
    taskType: string;
    time: number;
    category: string;
  }>
) => {
  const realm = await getRealm();
  try {
    const pomodoro = realm.objectForPrimaryKey("Pomodoro", id);
    if (pomodoro) {
      realm.write(() => {
        Object.assign(pomodoro, updates);
      });
    }
  } finally {
  }
};

export const deletePomodoro = async (id: ObjectId) => {
  const realm = await getRealm();
  try {
    const pomodoro = realm.objectForPrimaryKey("Pomodoro", id);
    if (pomodoro) {
      realm.write(() => {
        realm.delete(pomodoro);
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};

export const getPomodoroCount = async () => {
  const realm = await getRealm();
  const allPomodoros = realm.objects("Pomodoro");
  const total = allPomodoros.length;
  const totalTime = allPomodoros.sum("time");

  return {
    total,
    totalTime,
  };
};

export const getPomodoroStats = async (
  groupBy: "weekly" | "monthly" | "allTime" = "weekly"
) => {
  const realm = await getRealm();
  const allPomodoros = realm.objects("Pomodoro");

  if (groupBy === "allTime") {
    let total = 0;
    let totalTime = 0;

    allPomodoros.forEach((item: any) => {
      total += 1;
      totalTime += item.time;
    });

    return { total, totalTime };
  }

  const statsMap: Record<string, { total: number; totalTime: number }> = {};

  allPomodoros.forEach((item: any) => {
    const date = new Date(item.createdAt);
    let key = "";

    if (groupBy === "weekly") {
      const year = date.getFullYear();
      const week = getISOWeek(date);
      key = `${year}-W${String(week).padStart(2, "0")}`;
    } else if (groupBy === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (!statsMap[key]) {
      statsMap[key] = { total: 0, totalTime: 0 };
    }

    statsMap[key].total += 1;
    statsMap[key].totalTime += item.time;
  });

  return statsMap;
};
