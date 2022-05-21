// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import {
  ChangeTaskStatus,
  Task,
  TaskListItem,
  TaskStatus,
  User,
  WithoutId,
} from "./models.ts";
import {
  changeTaskStatusCollection,
  getTaskListCollection,
  taskCollection,
  taskStatusCollection,
  userCollection,
} from "./repository.ts";

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
  const usersCreated = await Promise.all(
    users.map(async (user) => {
      // idを自動生成するために、一度参照を取得する
      const newUserRef = doc(userCollection);
      const value: User = {
        id: newUserRef.id,
        name: user.name,
      };
      await setDoc(newUserRef, value);
      return value;
    }),
  );

  console.log("--- CREATE Tasks");
  const tasksCreated = await Promise.all(
    tasks.map(async (task) => {
      const newTaskRef = doc(taskCollection);
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
  const joined = usersCreated.flatMap((user) =>
    tasksCreated.map((task) => [user, task] as const)
  );
  await Promise.all(
    joined.map(async ([user, task]) => {
      const taskStatusId = randomStatusId();

      // タスクステータスを記録
      const changeTaskStatusRef = doc(changeTaskStatusCollection);
      const changeTaskStatus: ChangeTaskStatus = {
        id: changeTaskStatusRef.id,
        taskId: task.id,
        userId: user.id,
        taskStatusId,
      };
      await setDoc(changeTaskStatusRef, changeTaskStatus);

      // ユーザーのタスク一覧を非正規化して保存する
      const taskListCollection = getTaskListCollection(user.id);
      const taskListItemRef = doc(taskListCollection);
      const taskListItem: TaskListItem = {
        id: taskListItemRef.id,
        taskId: task.id,
        userId: user.id,
        taskTitle: task.title,
        taskDescription: task.description,
        taskStatusId,
        taskStatusName: taskStatus[taskStatusId].name,
      };
      await setDoc(taskListItemRef, taskListItem);
    }),
  );

  console.log("--- done");
};

initData();
