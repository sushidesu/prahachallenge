export type Task = {
  id: string;
  title: string;
};

export type TaskStatusTable = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
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

export const DATABASE_PATH = {
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
  TASK_STATUS_TABLE: {
    path: "taskStatusTable",
  },
};

export type WithoutId<T extends { id: string }> = Omit<T, "id">;
