export const TaskSchema: Realm.ObjectSchema = {
  name: "Task",
  embedded: true,
  properties: {
    id: "string",
    title: "string",
    isCompleted: "bool",
    deadline: "date?",
  },
};

export const ChecklistSchema: Realm.ObjectSchema = {
  name: "Checklist",
  primaryKey: "_id",
  properties: {
    _id: "objectId",
    title: "string",
    description: "string?",
    taskType: "string",
    isCompleted: "bool",
    category: "string",
    createdAt: "date?",
    deadline: "date?",
    lastSaved: "date?",
    tasks: "Task[]",
  },
};

export const schemas = [ChecklistSchema, TaskSchema];
