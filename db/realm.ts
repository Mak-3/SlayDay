import Realm from "realm";
import PomodoroSchema  from "./schema/PomodoroSchema";
import { ChecklistSchema, TaskSchema } from "./schema/ChecklistSchema";
import { EventSchema } from "./schema/EventSchema";
import { UserPreferencesSchema, UserSchema } from "./schema/UserSchema";

let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (realmInstance) return realmInstance;

  realmInstance = await Realm.open({
    schema: [PomodoroSchema, ChecklistSchema, EventSchema, TaskSchema, UserSchema, UserPreferencesSchema ],
    schemaVersion: 14,
  });

  return realmInstance;
};