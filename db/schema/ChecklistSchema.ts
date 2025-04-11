export const TaskSchema: Realm.ObjectSchema = {
  name: "Task",
  embedded: true,
  properties: {
    title: "string",
    isCompleted: "bool",
  },
};

export const ChecklistSchema: Realm.ObjectSchema = {
  name: "Checklist",
  primaryKey: "_id",
  properties: {
    _id: "objectId",
    title: "string",
    description: "string",
    taskType: "string",
    isCompleted: "bool",
    category: "string",
    createdAt: "int",
    endAt: "int",
    tasks: "Task[]",
  },
};

export const schemas = [ChecklistSchema, TaskSchema];
