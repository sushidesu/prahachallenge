// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  addDoc,
  collection,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import {
  ChangeTaskStatus,
  DATABASE_PATH,
  Task,
  TaskStatus,
  TaskStatusTable,
  User,
  WithoutId,
} from "./models.ts";
import { firestore } from "./firebase.ts";

const initData = async () => {
  const tasks: WithoutId<Task>[] = [
    {
      title: "DNSを学ぼう",
      description: "digコマンドを使って普段使っているwebサイトのdnsレコードを調べてみよう！",
    },
    {
      title: "TypeScriptで色んな型を作ってみよう",
      description: "Pick<T>を自作してみよう！",
    },
    {
      title: "Cloudflare D1を使ってみよう",
      description: "特大課題のデータベースをD1に移行してみよう！",
    },
  ];
  const users: WithoutId<User>[] = [
    { name: "Eric Evans" },
    {
      name: "Martin Fowler",
    },
    {
      name: "Kent Beck",
    },
    {
      name: "Linus Torvalds",
    },
    {
      name: "Rob Pike",
    },
  ];
  const taskStatus: Record<TaskStatus["id"], TaskStatus> = {
    "unfinished": {
      id: "finished",
      name: "未完了",
    },
    "finished": {
      id: "unfinished",
      name: "完了",
    },
  };

  console.log("--- CREATE Users");
  const usersCollection = collection(firestore, DATABASE_PATH.USERS.path);
  const usersCreated = await Promise.all(
    users.map(async (user) => {
      // idを自動生成するために、一度参照を取得する
      const newUserRef = doc(usersCollection);
      const value: User = {
        id: newUserRef.id,
        name: user.name,
      };
      await setDoc(newUserRef, value);
      return value;
    }),
  );
  console.log("--- CREATE Tasks");
  const tasksCollection = collection(firestore, DATABASE_PATH.TASKS.path);
  const tasksCreated = await Promise.all(
    tasks.map(async (task) => {
      const newTaskRef = doc(tasksCollection);
      const value: Task = {
        id: newTaskRef.id,
        title: task.title,
        description: task.description,
      };
      await setDoc(newTaskRef, value);
      return value;
    }),
  );
  console.log("--- CREATE TaskStatus");
  const taskStatusCollection = collection(
    firestore,
    DATABASE_PATH.TASK_STATUS.path,
  );
  await Promise.all(
    [
      setDoc(
        doc(taskStatusCollection, taskStatus.finished.id),
        taskStatus.finished,
      ),
      setDoc(
        doc(taskStatusCollection, taskStatus.unfinished.id),
        taskStatus.unfinished,
      ),
    ],
  );

  const randomStatusId = (): TaskStatus["id"] => {
    return Math.random() < 0.3 ? "finished" : "unfinished";
  };

  console.log("--- Register TaskStatus");
  const joined = tasksCreated.flatMap((task) =>
    usersCreated.map((user) => [task, user] as const)
  );
  const changeTaskStatusCollection = collection(
    firestore,
    DATABASE_PATH.CHANGE_TASK_STATUS.path,
  );
  const taskStatusTableCollection = collection(
    firestore,
    DATABASE_PATH.TASK_STATUS_TABLE.path,
  );
  await Promise.all(
    joined.map(async ([task, user]) => {
      const taskStatusId = randomStatusId();
      const changeTaskStatus: WithoutId<ChangeTaskStatus> = {
        taskId: task.id,
        userId: user.id,
        taskStatusId,
      };
      const taskStatusTable: WithoutId<TaskStatusTable> = {
        taskId: task.id,
        userId: user.id,
        userName: user.name,
        taskStatusId,
        taskStatusName: taskStatus[taskStatusId].name,
      };
      await addDoc(changeTaskStatusCollection, changeTaskStatus);
      await addDoc(taskStatusTableCollection, taskStatusTable);
    }),
  );

  console.log("--- done");
};

initData();
