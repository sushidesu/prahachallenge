import { firestore } from "https://deno.land/x/dfirestore@v0.3.11/mod.ts";
import { DATABASE_PATH, Task, TaskStatus, User, WithoutId } from "./models.ts";

const initData = async () => {
  const tasks: WithoutId<Task>[] = [
    { title: "DNSを学ぼう" },
    { title: "TypeScriptで色んな型を作ってみよう" },
    { title: "Cloudflare D1を使ってみよう" },
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
  const taskStatus: TaskStatus[] = [
    {
      id: "unfinished",
      name: "未完了",
    },
    {
      id: "finished",
      name: "完了",
    },
  ];

  console.log("--- CREATE Users");
  await Promise.all(
    users.map((user) =>
      firestore.createDocument({
        collection: DATABASE_PATH["USERS"]["path"],
        value: {
          name: {
            stringValue: user.name,
          },
        },
      })
    ),
  );
  console.log("--- CREATE Tasks");
  await Promise.all(
    tasks.map((task) =>
      firestore.createDocument({
        collection: DATABASE_PATH["TASKS"]["path"],
        value: {
          name: {
            stringValue: task.title,
          },
        },
      })
    ),
  );
  console.log("--- CREATE TaskStatus");
  await Promise.all(
    taskStatus.map((status) =>
      firestore.createDocument({
        collection: DATABASE_PATH["TASK_STATUS"]["path"],
        id: status.id,
        value: {
          name: {
            stringValue: status.name,
          },
        },
      })
    ),
  );

  // 作成したデータを取得
  const tasksCreated = await firestore.getDocument({
    collection: DATABASE_PATH["TASKS"]["path"],
  });
  const usersCreated = await firestore.getDocument({
    collection: DATABASE_PATH["USERS"]["path"],
  });
  const taskStatusCreated = {
    taskFinished: await firestore.getDocument({
      collection: DATABASE_PATH["TASK_STATUS"]["path"],
      id: "finished",
    }),
    taskUnfinished: await firestore.getDocument({
      collection: DATABASE_PATH["TASK_STATUS"]["path"],
      id: "unfinished",
    }),
  };

  const randomStatusId = (): TaskStatus["id"] => {
    return Math.random() < 0.3 ? "finished" : "unfinished";
  };

  /**
   * "projects/prahachallenge-ddd/databases/(default)/documents/tasks/af6rgmigUDPXYalbXpNI" から id を取得する
   */
  const getId = (name: string): string => {
    return name.split("/")[6];
  };

  console.log("--- Register TaskStatus");
  const joined = tasksCreated.documents.flatMap((task) =>
    usersCreated.documents.map((user) => [task, user] as const)
  );
  await Promise.all(
    joined.map(async (taskWithUser) => {
      const task = taskWithUser[0];
      const user = taskWithUser[1];
      const taskId = task.name;
      const userId = user.name;
      const taskStatusId = randomStatusId();
      const taskStatus = taskStatusId === "finished"
        ? taskStatusCreated.taskFinished
        : taskStatusCreated.taskUnfinished;

      console.log(`create: ${taskId}, ${userId}`);
      const hoge = await firestore.createDocument({
        collection: DATABASE_PATH["CHANGE_TASK_STATUS"]["path"],
        value: {
          taskId: {
            referenceValue: taskId,
          },
          userId: {
            referenceValue: userId,
          },
          taskStatusId: {
            referenceValue: (taskStatus as any).name,
          },
        },
      });
      console.log(hoge);
      const fuga = await firestore.createDocument({
        collection: DATABASE_PATH["TASK_STATUS_TABLE"]["path"],
        value: {
          taskId: {
            referenceValue: task.name,
          },
          userId: {
            stringValue: getId(userId),
          },
          userName: {
            stringValue: user.fields["name"].stringValue,
          },
          taskStatusId: {
            stringValue: taskStatusId,
          },
          taskStatusName: {
            stringValue: taskStatus.fields["name"].stringValue,
          },
        },
      });
      console.log(fuga);
    }),
  );
};

initData();
