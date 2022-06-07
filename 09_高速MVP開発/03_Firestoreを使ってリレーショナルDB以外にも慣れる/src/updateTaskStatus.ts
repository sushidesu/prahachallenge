// @deno-types="https://cdn.esm.sh/v58/firebase@9.8.1/firestore/dist/firestore/index.d.ts"
import {
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { Either, left, right } from "https://deno.land/x/fun@v1.0.0/either.ts";
import {
  changeTaskStatusCollection,
  getTaskListCollection,
  taskCollection,
  taskStatusCollection,
  userCollection,
} from "./repository.ts";
import {
  ChangeTaskStatus,
  Task,
  TaskListItem,
  TaskStatus,
  User,
} from "./models.ts";

export const updateTaskStatus = async (props: {
  userId: User["id"];
  taskId: Task["id"];
  taskStatusId: TaskStatus["id"];
}): Promise<Either<{ success: true }, { success: false; message: string }>> => {
  const { userId, taskId, taskStatusId } = props;
  // ユーザーの存在確認
  const userRef = doc(userCollection, userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return right({
      success: false,
      message: `userId: "${userId}" is not found`,
    });
  }

  // タスクの存在確認
  const taskRef = doc(taskCollection, taskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) {
    return right({
      success: false,
      message: `taskId: "${taskId}" is not found`,
    });
  }

  // ChangeTaskStatusにレコードを追加
  const changeTaskStatusRef = doc(changeTaskStatusCollection);
  const changeTaskStatus: ChangeTaskStatus = {
    id: changeTaskStatusRef.id,
    taskId,
    taskStatusId,
    userId,
  };
  await setDoc(changeTaskStatusRef, changeTaskStatus);

  // TaskStatusListを更新
  const taskListCollection = getTaskListCollection(userId);
  const queryTaskListItemByTaskId = query(
    taskListCollection,
    where("taskId", "==", taskId),
  );
  const taskListSnap = await getDocs(queryTaskListItemByTaskId);
  // 1件のみ取得できる想定だが、件数チェックなどはせずにそのまま処理する
  await Promise.all(taskListSnap.docs.map(async (d) => {
    // TaskStatusの名前を取得する
    const taskStatusSnap = await getDoc(
      doc(taskStatusCollection, taskStatusId),
    );
    const taskStatus: TaskStatus | undefined = taskStatusSnap.data();
    console.log(taskStatus);
    // updateDoc()を使用して一部フィールドのみを更新
    const taskListItem: TaskListItem = d.data();
    await updateDoc(doc(taskListCollection, taskListItem.id), {
      taskStatusId,
      taskStatusName: taskStatus?.name ?? "", // ← optionalの部分は仮実装
    });
  }));

  return left({ success: true });
};
