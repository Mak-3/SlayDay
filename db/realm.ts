import Realm from "realm";

class Pomodoro extends Realm.Object<Pomodoro> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  taskType!: string;
  time!: number;
  category!: string;
  createdAt!: Date;

  static schema = {
    name: "Pomodoro",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      title: "string",
      taskType: "string",
      time: "int",
      category: "string",
      createdAt: "date",
    },
  };
}

let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (realmInstance) return realmInstance;

  realmInstance = await Realm.open({
    schema: [Pomodoro],
    schemaVersion: 1,
  });

  return realmInstance;
};