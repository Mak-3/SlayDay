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
  createdAt: Date;
  endAt: Date
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
    }
  } finally {
    
  }
};