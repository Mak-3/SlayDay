import Realm from "realm";

interface TaskBackup {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline: string | null;
}

interface ChecklistBackup {
  _id: string;
  title: string;
  description: string;
  taskType: string;
  isCompleted: boolean;
  category: string;
  createdAt: string;
  deadline?: string | null;
  lastSaved?: string | null;
  tasks: TaskBackup[];
}

interface EventBackup {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  repeatType: string;
  customInterval?: string;
  interval?: number;
  category: string;
  isOneTime: boolean;
  weekDays: string[];
  createdAt: string;
}

interface PomodoroBackup {
  _id: string;
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: string;
  endAt: string;
}

interface UserBackup {
  id: string;
  name?: string;
  userName?: string;
  email: string;
  profilePicture?: string;
  lastOpened: string;
  preferences?: {
    jsonUploadEnabled: boolean;
  };
}

interface BackupData {
  user?: UserBackup;
  checklists: ChecklistBackup[];
  events: EventBackup[];
  pomodoros: PomodoroBackup[];
}

// The restore function
async function restoreRealmData(
  realm: Realm,
  backup: BackupData | null
): Promise<void> {
  if (!backup) return;

  realm.write(() => {
    // Clear all existing data
    realm.deleteAll();

    // Restore User
    if (backup.user) {
      realm.create("User", {
        id: backup.user.id,
        name: backup.user.name,
        email: backup.user.email,
        profilePicture: backup.user.profilePicture,
        lastOpened: new Date(backup.user.lastOpened),
        preferences: backup.user.preferences
          ? {
              jsonUploadEnabled: backup.user.preferences.jsonUploadEnabled,
            }
          : null,
      });
    }

    // Restore Checklists and tasks
    backup.checklists.forEach((cl) => {
      realm.create("Checklist", {
        _id: new Realm.BSON.ObjectId(cl._id),
        title: cl.title,
        description: cl.description,
        taskType: cl.taskType,
        isCompleted: cl.isCompleted,
        category: cl.category,
        createdAt: new Date(cl.createdAt),
        deadline: cl.deadline ? new Date(cl.deadline) : null,
        lastSaved: cl.lastSaved ? new Date(cl.lastSaved) : null,
        tasks: cl.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          isCompleted: task.isCompleted,
          deadline: task.deadline ? new Date(task.deadline) : null,
        })),
      });
    });

    // Restore Events
    backup.events.forEach((ev) => {
      realm.create("Event", {
        _id: new Realm.BSON.ObjectId(ev._id),
        title: ev.title,
        description: ev.description,
        date: new Date(ev.date),
        time: new Date(ev.time),
        repeatType: ev.repeatType,
        customInterval: ev.customInterval,
        interval: ev.interval,
        category: ev.category,
        isOneTime: ev.isOneTime,
        weekDays: ev.weekDays,
        createdAt: new Date(ev.createdAt),
      });
    });

    // Restore Pomodoros
    backup.pomodoros.forEach((p) => {
      realm.create("Pomodoro", {
        _id: new Realm.BSON.ObjectId(p._id),
        title: p.title,
        taskType: p.taskType,
        time: p.time,
        category: p.category,
        createdAt: new Date(p.createdAt),
        endAt: new Date(p.endAt),
      });
    });
  });
}

export default restoreRealmData;
