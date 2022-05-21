// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { Either, left, right } from "https://deno.land/x/fun@v1.0.0/either.ts";
import { Task } from "./models.ts";
import {
  getTaskListCollection,
  taskCollection,
  userCollection,
} from "./repository.ts";

export const updateTask = async (
  props: {
    taskId: Task["id"];
    // 必要なフィールドのみ更新できる
    value: {
      title?: Task["title"];
      description?: Task["description"];
    };
  },
): Promise<
  Either<{ success: true }, { success: false; message: string }>
> => {
  const { taskId, value } = props;

  const taskRef = doc(taskCollection, taskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) {
    return right({
      success: false,
      message: `taskId: "${taskId}" is not found`,
    });
  }

  // 必要なフィールドのみ更新できる
  await updateDoc(taskRef, { ...value });

  // ユーザーを全取得する
  const users = await getDocs(userCollection);
  // ユーザーのsub collectionの課題の情報も更新する
  await Promise.all(users.docs.flatMap(async (user) => {
    const taskListCollection = getTaskListCollection(user.id);
    const queryTaskListItemByTaskId = query(
      taskListCollection,
      where("taskId", "==", taskId),
    );
    const taskList = await getDocs(queryTaskListItemByTaskId);
    // 1件のみ取得できる想定
    return taskList.docs.map(async (item) => {
      const taskItemRef = doc(taskListCollection, item.id);
      // オプショナルなフィールドをオプショナルさを保ったままマッピングしている (もっといいやりかたありそう)
      await updateDoc(taskItemRef, {
        ...value.title === undefined ? {} : { taskTitle: value.title },
        ...value.description === undefined
          ? {}
          : { taskDescription: value.description },
      });
    });
  }));

  return left({ success: true });
};
