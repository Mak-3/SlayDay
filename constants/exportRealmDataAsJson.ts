import { getRealm } from "@/db/realm";
import Realm from "realm";

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
  userName: string;
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
    userName: string;
    email: string;
    profilePicture?: string;
    lastOpened: string;
    preferences?: {
      jsonUploadEnabled: boolean;
    };
  } | null;
}

// The function
async function exportRealmData(): Promise<ExportedData> {
const realm = await getRealm();
  const checklists = realm.objects<Checklist>("Checklist").map(item => ({
    _id: item._id.toHexString(),
    title: item.title,
    description: item.description,
    taskType: item.taskType,
    isCompleted: item.isCompleted,
    category: item.category,
    createdAt: item.createdAt ? item.createdAt.toISOString() : null,
    deadline: item.deadline ? item.deadline.toISOString() : null,
    lastSaved: item.lastSaved ? item.lastSaved.toISOString() : null,
    tasks: item.tasks.map(task => ({
      id: task.id,
      title: task.title,
      isCompleted: task.isCompleted,
      deadline: task.deadline ? task.deadline.toISOString() : null,
    })),
  }));

  const events = realm.objects<Event>("Event").map(event => ({
    _id: event._id.toHexString(),
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    time: event.time.toISOString(),
    repeatType: event.repeatType,
    customInterval: event.customInterval,
    interval: event.interval,
    category: event.category,
    isOneTime: event.isOneTime,
    weekDays: event.weekDays,
    createdAt: event.createdAt.toISOString(),
  }));

  const pomodoros = realm.objects<Pomodoro>("Pomodoro").map(p => ({
    _id: p._id.toHexString(),
    title: p.title,
    taskType: p.taskType,
    time: p.time,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
    endAt: p.endAt.toISOString(),
  }));

  const userObj = realm.objects<User>("User")[0];
  const user = userObj ? {
    id: userObj.id,
    userName: userObj.userName,
    email: userObj.email,
    profilePicture: userObj.profilePicture,
    lastOpened: userObj.lastOpened.toISOString(),
    preferences: userObj.preferences ? {
      jsonUploadEnabled: userObj.preferences.jsonUploadEnabled,
    } : undefined,
  } : null;

  return { checklists, events, pomodoros, user };
}

export default exportRealmData;