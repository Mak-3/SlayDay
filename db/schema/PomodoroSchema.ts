const PomodoroSchema = {
  name: "Pomodoro",
  properties: {
    _id: "objectId",
    title: "string",
    taskType: "string",
    time: "int",
    category: "string",
    createdAt: "date",
    endAt: "date"
  },
  primaryKey: "_id",
};

export default PomodoroSchema;