// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { Either, left, right } from "https://deno.land/x/fun@v1.0.0/either.ts";
import { Task } from "./models.ts";
import {
  getTaskListCollection,
  taskCollection,
  userCollection,
} from "./repository.ts";

export const deleteTask = async (
  props: {
    taskId: Task["id"];
  },
): Promise<
  Either<{ success: true }, { success: false; message: string }>
> => {
  const { taskId } = props;

  const taskRef = doc(taskCollection, taskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) {
    return right({
      success: false,
      message: `taskId: "${taskId}" is not found`,
    });
  }

  // タスクを削除
  await deleteDoc(taskRef);

  // ユーザーを全取得する
  const users = await getDocs(userCollection);

  // ユーザーのsub collectionの課題を削除する
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
      await deleteDoc(taskItemRef);
    });
  }));

  return left({ success: true });
};
