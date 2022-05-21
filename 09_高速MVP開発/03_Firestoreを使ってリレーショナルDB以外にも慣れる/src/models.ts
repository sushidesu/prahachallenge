export type Task = {
  id: string;
  title: string;
  description: string;
};

export type TaskListItem = {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  taskStatusId: string;
  taskStatusName: string;
};

export type ChangeTaskStatus = {
  id: string;
  taskId: string;
  taskStatusId: string;
  userId: string;
};

export type TaskStatus = {
  id: "finished" | "unfinished";
  name: string;
};

export type User = {
  id: string;
  name: string;
};

export type WithoutId<T extends { id: string }> = Omit<T, "id">;
