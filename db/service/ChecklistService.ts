import { getRealm } from "../realm";
import { ObjectId } from "bson";

export const createChecklist = async ({
  title,
  description,
  taskType,
  category,
  isCompleted,
  createdAt,
  deadline,
  tasks,
}: {
  title: string;
  description: string;
  taskType: string;
  category: string;
  isCompleted: boolean;
  createdAt: Date;
  deadline?: Date;
  lastSaved?: Date;
  tasks: { title: string; isCompleted: boolean; deadline?: Date }[];
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
        ...(deadline && { deadline }),
        tasks: tasks.map((task) => ({
          title: task.title,
          isCompleted: task.isCompleted,
          ...(task.deadline && { deadline: task.deadline }),
        })),
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
            id: task._id,
            title: task.title,
            isCompleted: task.isCompleted,
          }))
        : [];

    return {
      id: checklist._id,
      name: checklist.title,
      completed: checklist.isCompleted,
      description: checklist.description,
      category: checklist.category,
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
    deadline: Date;
    lastSaved: Date;
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

export const getChecklistCount = async () => {
  const realm = await getRealm();
  const allChecklists = realm.objects("Checklist");
  const total = allChecklists.length;
  const completed = allChecklists.filtered("isCompleted == true").length;
  const incomplete = total - completed;

  return {
    total,
    completed,
    incomplete,
  };
};
