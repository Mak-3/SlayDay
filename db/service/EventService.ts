import Realm from "realm";
import { EventSchema } from "../schema/EventSchema";
import { ObjectId } from "bson";

// Open the Realm with the Event schema
const getRealmInstance = async () => {
  return await Realm.open({
    schema: [EventSchema],
    schemaVersion: 1,
  });
};

// Create a new event
export const createEvent = async (eventData: Partial<Omit<Event, "_id">>) => {
  const realm = await getRealmInstance();
  let createdEvent;

  realm.write(() => {
    createdEvent = realm.create("Event", {
      _id: new ObjectId(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return createdEvent;
};

// Read all events
export const getAllEvents = async () => {
  const realm = await getRealmInstance();
  return realm.objects("Event").sorted("date");
};

// Get event by ID
export const getEventById = async (id: string) => {
  const realm = await getRealmInstance();
  return realm.objectForPrimaryKey("Event", new ObjectId(id));
};

// Update an event
export const updateEvent = async (id: string, updates: Partial<Event>) => {
  const realm = await getRealmInstance();
  let updatedEvent;

  realm.write(() => {
    const event = realm.objectForPrimaryKey("Event", new ObjectId(id));
    if (event) {
      Object.assign(event, updates, { updatedAt: new Date() });
      updatedEvent = event;
    }
  });

  return updatedEvent;
};

// Delete an event
export const deleteEvent = async (id: string) => {
  const realm = await getRealmInstance();

  realm.write(() => {
    const event = realm.objectForPrimaryKey("Event", new ObjectId(id));
    if (event) {
      realm.delete(event);
    }
  });
};