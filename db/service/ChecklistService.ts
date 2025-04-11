import { getRealm } from "../realm";
import { ObjectId } from "bson";

export const createChecklist = async ({
  title,
  description,
  taskType,
  category,
  isCompleted,
  createdAt,
  endAt,
  tasks,
}: {
  title: string;
  description: string;
  taskType: string;
  category: string;
  isCompleted: boolean;
  createdAt: number;
  endAt: number;
  tasks: { title: string; isCompleted: boolean }[];
}) => {
  const realm = await getRealm();
  let newChecklistId = null;
  try {
    realm.write(() => {
      const checklist = realm.create("Checklist", {
        _id: new ObjectId(),
        title,
        description,
        taskType,
        category,
        isCompleted,
        createdAt,
        endAt,
        tasks,
      });
      newChecklistId = checklist._id;
    });
  } finally {
    
  }
  return newChecklistId;
};

export const getAllChecklists = async () => {
  const realm = await getRealm();
  const checklists = realm.objects("Checklist").sorted("createdAt", true);

  const normalized = checklists.map((checklist: any) => {
    const plainTasks =
      checklist.tasks && typeof checklist.tasks.map === "function"
        ? checklist.tasks.map((task: any) => ({
            title: task.title,
            isCompleted: task.isCompleted,
          }))
        : [];

    return {
      id: checklist._id,
      name: checklist.title,
      completed: checklist.isCompleted,
      description: checklist.description,
      icon: checklist.icon ?? "folder",
      items: plainTasks,
    };
  });

  return normalized;
};

export const updateChecklist = async (
  id: ObjectId,
  updates: Partial<{
    title: string;
    description: string;
    taskType: string;
    category: string;
    isCompleted: boolean;
    tasks: { title: string; isCompleted: boolean }[];
  }>
) => {
  const realm = await getRealm();
  try {
    const checklist = realm.objectForPrimaryKey("Checklist", id);
    if (checklist) {
      realm.write(() => {
        Object.assign(checklist, updates);
      });
    }
  } finally {
    
  }
};

export const deleteChecklist = async (id: ObjectId) => {
  const realm = await getRealm();
  try {
    const checklist = realm.objectForPrimaryKey("Checklist", id);
    if (checklist) {
      realm.write(() => {
        realm.delete(checklist);
      });
    }
  } finally {
    
  }
};

export const getChecklistById = async (id: string) => {
  const realm = await getRealm();
  const checklist = realm.objectForPrimaryKey("Checklist", new ObjectId(id));
  return checklist ? JSON.parse(JSON.stringify(checklist)) : null;
};





// to be removed in future

export const clearRealmDatabase = async () => {
  const realm = await getRealm();

  try {
    realm.write(() => {
      realm.deleteAll(); // ⚠️ Deletes all objects from all schemas
    });
    console.log("Realm database cleared.");
  } catch (error) {
    console.error("Error clearing Realm DB:", error);
  }
};