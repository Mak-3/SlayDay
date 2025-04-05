export const PomodoroSchema = {
  name: "Pomodoro",
  properties: {
    _id: "objectId",
    title: "string",
    taskType: "string",
    time: "int",
    category: "string",
    createdAt: "int",
    endAt: "int"
  },
  primaryKey: "_id",
};
