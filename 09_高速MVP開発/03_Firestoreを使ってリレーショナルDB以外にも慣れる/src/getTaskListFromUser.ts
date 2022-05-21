// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { firestore } from "./firebase.ts";
import { DATABASE_PATH, Task, TaskStatusTable, User } from "./models.ts";

type GetTaskListFromUserDTO = {
  user: UserDTO;
  tasks: TaskDTO[];
};

type TaskDTO = {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  statusId: string;
  statusName: string;
};

type UserDTO = {
  id: string;
  name: string;
};

export const getTaskListFromUser = async (userId: string): Promise<
  GetTaskListFromUserDTO | undefined
> => {
  const userRef = collection(firestore, DATABASE_PATH.USERS.path);
  const taskRef = collection(firestore, DATABASE_PATH.TASKS.path);
  const taskStatusTableRef = collection(
    firestore,
    DATABASE_PATH.TASK_STATUS_TABLE.path,
  );

  const userSnapshot = await getDoc(doc(userRef, userId));
  if (!userSnapshot.exists()) {
    return undefined;
  }

  const queryTaskStatusTableByUserId = query(
    taskStatusTableRef,
    where("userId", "==", userId),
  );
  const taskStatusTableSnapshot = await getDocs(queryTaskStatusTableByUserId);
  const tableRows = taskStatusTableSnapshot.docs.map((v) =>
    v.data()
  ) as TaskStatusTable[];

  const user = userSnapshot.data() as User;
  const tasks: TaskDTO[] = await Promise.all(
    tableRows.map<Promise<TaskDTO>>(async (row) => {
      const taskSnapshot = await getDoc(doc(taskRef, row.taskId));
      const task = taskSnapshot.data() as Task;
      return {
        taskId: row.taskId,
        taskTitle: task.title,
        taskDescription: task.description,
        statusId: row.taskStatusId,
        statusName: row.taskStatusName,
      };
    }),
  );

  return {
    user: {
      id: user.id,
      name: user.name,
    },
    tasks,
  };
};
