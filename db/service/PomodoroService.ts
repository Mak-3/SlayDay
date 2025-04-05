import { getRealm } from "../realm";
import { ObjectId } from "bson";

export const createPomodoro = async ({
  title,
  taskType,
  time,
  category,
  createdAt,
  endAt
}: {
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: number;
  endAt: number
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
        endAt
      });
    });
  } finally {
    realm.close();
  }
};

export const getAllPomodoros = async () => {
  const realm = await getRealm();
  const pomodoros = realm.objects("Pomodoro").sorted("createdAt", true);
  return pomodoros;
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
    realm.close();
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
    }
  } finally {
    realm.close();
  }
};