import { getRealm } from "../realm";
import { ObjectId } from "bson";

export const createChecklist = async ({
  title,
  Description,
  taskType,
  category,
  createdAt,
  endAt,
  tasks,
}: {
  title: string;
  Description: string;
  taskType: string;
  category: string;
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
        Description,
        taskType,
        category,
        createdAt,
        endAt,
        tasks,
      });
      newChecklistId = checklist._id.toHexString();
    });
  } finally {
    realm.close();
  }
  return newChecklistId;
};

export const getAllChecklists = async () => {
  const realm = await getRealm();
  const checklists = realm.objects("Checklist").sorted("createdAt", true);
  return checklists;
};

export const updateChecklist = async (
  id: ObjectId,
  updates: Partial<{
    title: string;
    Description: string;
    taskType: string;
    category: string;
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
    realm.close();
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
    realm.close();
  }
};

export const getChecklistById = async (id: string) => {
  const realm = await getRealm();
  const checklist = realm.objectForPrimaryKey("Checklist", new ObjectId(id));
  return checklist ? JSON.parse(JSON.stringify(checklist)) : null;
};
