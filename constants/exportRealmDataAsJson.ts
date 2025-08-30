import { getRealm } from "@/db/realm";
import Realm from "realm";

function convertRealmObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Realm.List) {
    return Array.from(obj).map(convertRealmObject);
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (obj instanceof Realm.BSON.ObjectId) {
    return obj.toHexString();
  }
  
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertRealmObject(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
}

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline: Date | null;
}

interface Checklist {
  _id: Realm.BSON.ObjectId;
  title: string;
  description: string;
  taskType: string;
  isCompleted: boolean;
  category: string;
  createdAt: Date;
  deadline?: Date;
  lastSaved?: Date;
  tasks: Realm.List<Task>;
}

interface Event {
  _id: Realm.BSON.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: Date;
  repeatType: string;
  customInterval?: string;
  interval?: number;
  category: string;
  isOneTime: boolean;
  weekDays: string[];
  createdAt: Date;
}

interface Pomodoro {
  _id: Realm.BSON.ObjectId;
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: Date;
  endAt: Date;
}

interface Preferences {
  jsonUploadEnabled: boolean;
}

interface User {
  id: string;
  name: string;
  userName?: string;
  email: string;
  profilePicture?: string;
  lastOpened: Date;
  preferences?: Preferences;
}

// Define the return type
interface ExportedData {
  checklists: any[];
  events: any[];
  pomodoros: any[];
  user: {
    id: string;
    name: string;
    userName?: string;
    email: string;
    profilePicture?: string;
    lastOpened: string;
    preferences?: {
      jsonUploadEnabled: boolean;
    };
  } | null;
}

async function exportRealmData(): Promise<ExportedData> {
  const realm = await getRealm();
  
  // Use the utility function to safely convert all Realm objects
  const checklists = realm.objects<Checklist>("Checklist").map((item) => 
    convertRealmObject({
      _id: item._id,
      title: item.title,
      description: item.description,
      taskType: item.taskType,
      isCompleted: item.isCompleted,
      category: item.category,
      createdAt: item.createdAt,
      deadline: item.deadline,
      lastSaved: item.lastSaved,
      tasks: item.tasks,
    })
  );

  const events = realm.objects<Event>("Event").map((event) => 
    convertRealmObject({
      _id: event._id,
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
    })
  );

  const pomodoros = realm.objects<Pomodoro>("Pomodoro").map((p) => 
    convertRealmObject({
      _id: p._id,
      title: p.title,
      taskType: p.taskType,
      time: p.time,
      category: p.category,
      createdAt: p.createdAt,
      endAt: p.endAt,
    })
  );

  const userObj = realm.objects<User>("User")[0];
  const user = userObj
    ? convertRealmObject({
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        profilePicture: userObj.profilePicture,
        lastOpened: userObj.lastOpened,
        preferences: userObj.preferences,
      })
    : null;

  return { checklists, events, pomodoros, user };
}

export default exportRealmData;
