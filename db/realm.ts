import Realm from "realm";
import PomodoroSchema  from "./schema/PomodoroSchema";
import { ChecklistSchema, TaskSchema } from "./schema/ChecklistSchema";

let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (realmInstance) return realmInstance;

  realmInstance = await Realm.open({
    schema: [PomodoroSchema, ChecklistSchema, TaskSchema],
    schemaVersion: 3,
  });

  return realmInstance;
};