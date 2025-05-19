import { getRealm } from "../realm";
import { ObjectId } from "bson";

export const createEvent = async ({
  title,
  description,
  date,
  time,
  repeatType,
  customInterval,
  interval,
  category,
  isOneTime,
  weekDays,
  createdAt,
}: {
  title: string;
  description?: string;
  date: Date;
  time: Date;
  repeatType?: string;
  customInterval?: string;
  interval?: number;
  category?: string;
  isOneTime: boolean;
  weekDays?: string[];
  createdAt: Date;
}) => {
  const realm = await getRealm();
  let newEventId = null;
  try {
    realm.write(() => {
      const event = realm.create("Event", {
        _id: new ObjectId(),
        title,
        description,
        date,
        time,
        repeatType,
        customInterval,
        interval,
        category,
        isOneTime,
        weekDays,
        createdAt,
      });
      newEventId = event._id;
    });
  } finally {
    // Optional cleanup
  }
  return newEventId;
};

export const getAllEvents = async () => {
  const realm = await getRealm();
  const events = realm.objects("Event").sorted("createdAt", true);

  return events.map((event: any) => ({
    id: event._id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    repeatType: event.repeatType,
    customInterval: event.customInterval,
    interval: event.interval,
    category: event.category,
    isOneTime: event.isOneTime,
    weekDays: event.weekDays,
    createdAt: event.createdAt,
  }));
};

export const updateEvent = async (
  id: ObjectId,
  updates: Partial<{
    title: string;
    description?: string;
    date: Date;
    time: Date;
    repeatType?: string;
    customInterval?: string;
    interval?: number;
    category?: string;
    isOneTime: boolean;
    weekDays?: string[];
  }>
) => {
  const realm = await getRealm();
  try {
    const event = realm.objectForPrimaryKey("Event", id);
    if (event) {
      realm.write(() => {
        Object.assign(event, updates);
      });
    }
  } finally {
    // Optional cleanup
  }
};

export const deleteEvent = async (id: ObjectId) => {
  const realm = await getRealm();
  try {
    const event = realm.objectForPrimaryKey("Event", id);
    if (event) {
      realm.write(() => {
        realm.delete(event);
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};

export const getEventById = async (id: string) => {
  const realm = await getRealm();
  const event = realm.objectForPrimaryKey("Event", new ObjectId(id));
  return event ? JSON.parse(JSON.stringify(event)) : null;
};

export const getEventCount = async () => {
  const realm = await getRealm();
  const allEvents = realm.objects("Event");
  const total = allEvents.length;
  const oneTime = allEvents.filtered("isOneTime == true").length;
  const recurring = total - oneTime;

  return {
    total,
    oneTime,
    recurring,
  };
};
