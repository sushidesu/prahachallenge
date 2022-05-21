// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { firestore } from "./firebase.ts";
import { DATABASE_PATH, TaskListItem, User } from "./models.ts";

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
  const userRef = collection(firestore, DATABASE_PATH.USERS.path);
  const userSnapshot = await getDoc(doc(userRef, userId));
  if (!userSnapshot.exists()) {
    return undefined;
  }
  const user = userSnapshot.data() as User;

  const taskListRef = collection(
    firestore,
    DATABASE_PATH.TASK_LIST.genPath(userId),
  );
  const taskListSnapshot = await getDocs(taskListRef);
  const taskList = taskListSnapshot.docs.map((v) => v.data()) as TaskListItem[];

  const tasks: TaskDTO[] = taskList.map((item) => ({
    taskId: item.taskId,
    taskTitle: item.taskTitle,
    taskDescription: item.taskDescription,
    statusId: item.taskStatusId,
    statusName: item.taskStatusName,
  }));

  return {
    id: user.id,
    name: user.name,
    questions: tasks,
  };
};
