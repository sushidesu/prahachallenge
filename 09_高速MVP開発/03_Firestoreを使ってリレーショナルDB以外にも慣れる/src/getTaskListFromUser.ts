// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  doc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { User } from "./models.ts";
import { getTaskListCollection, userCollection } from "./repository.ts";

type GetTaskListFromUserDTO = {
  id: string;
  name: string;
  questions: TaskDTO[];
};

type TaskDTO = {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  statusId: string;
  statusName: string;
};

export const getTaskListFromUser = async (userId: string): Promise<
  GetTaskListFromUserDTO | undefined
> => {
  const userRef = doc(userCollection, userId);
  const userSnapshot = await getDoc(userRef);
  if (!userSnapshot.exists()) {
    return undefined;
  }
  const user: User = userSnapshot.data();

  const taskListCollection = getTaskListCollection(userId);
  const taskListSnapshot = await getDocs(taskListCollection);
  const tasks: TaskDTO[] = taskListSnapshot.docs.map((d) => {
    const item = d.data();
    return {
      taskId: item.taskId,
      taskTitle: item.taskTitle,
      taskDescription: item.taskDescription,
      statusId: item.taskStatusId,
      statusName: item.taskStatusName,
    };
  });

  return {
    id: user.id,
    name: user.name,
    questions: tasks,
  };
};

const r = await getTaskListFromUser("xJOiYGrv6wgVeUhyIAFs");
console.info(r);
