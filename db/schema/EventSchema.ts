export const EventSchema = {
  name: "Event",
  primaryKey: "_id",
  properties: {
    _id: "objectId",
    title: "string",
    description: "string?",
    date: "date",
    time: "date",
    repeatType: "string?",
    customInterval: "string?",
    interval: "int?",
    category: "string?",
    isOneTime: "bool",
    weekDays: "string[]",
    createdAt: "date",
  },
};
