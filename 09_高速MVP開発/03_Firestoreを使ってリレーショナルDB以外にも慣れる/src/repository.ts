// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  collection,
  FirestoreDataConverter,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { firestore } from "./firebase.ts";
import {
  ChangeTaskStatus,
  Task,
  TaskListItem,
  TaskStatus,
  User,
} from "./models.ts";

const DATABASE_PATH = {
  USERS: {
    path: "users",
  },
  TASKS: {
    path: "tasks",
  },
  CHANGE_TASK_STATUS: {
    path: "changeTaskStatus",
  },
  TASK_STATUS: {
    path: "taskStatus",
  },
  TASK_LIST: {
    genPath: (userId: string) => `users/${userId}/taskList/`,
  },
};

/**
 * データをそのまま書き込み & 読込みするだけ
 */
const genEasyConverter = <
  T extends Record<string, unknown>,
>(): FirestoreDataConverter<T> => {
  return {
    toFirestore: (v) => ({
      ...v,
    }),
    fromFirestore: (v) => {
      const data = v.data() as T;
      return data;
    },
  };
};

const taskConverter: FirestoreDataConverter<Task> = genEasyConverter();
const taskStatusConverter: FirestoreDataConverter<TaskStatus> =
  genEasyConverter();
const userConverter: FirestoreDataConverter<User> = genEasyConverter();
const changeTaskStatusConverter: FirestoreDataConverter<ChangeTaskStatus> =
  genEasyConverter();
const taskListConverter: FirestoreDataConverter<TaskListItem> =
  genEasyConverter();

// collection().withConverter() に converterを渡すことで、getDoc()などの結果に型がつく
export const taskCollection = collection(firestore, DATABASE_PATH.TASKS.path)
  .withConverter(taskConverter);
export const taskStatusCollection = collection(
  firestore,
  DATABASE_PATH.TASK_STATUS.path,
).withConverter(taskStatusConverter);
export const userCollection = collection(firestore, DATABASE_PATH.USERS.path)
  .withConverter(userConverter);
export const changeTaskStatusCollection = collection(
  firestore,
  DATABASE_PATH.CHANGE_TASK_STATUS.path,
).withConverter(changeTaskStatusConverter);
export const getTaskListCollection = (userId: string) =>
  collection(firestore, DATABASE_PATH.TASK_LIST.genPath(userId)).withConverter(
    taskListConverter,
  );
