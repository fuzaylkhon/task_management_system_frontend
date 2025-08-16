export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string | { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role?: "user" | "admin";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Analytics {
  overview: {
    totalUsers: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    avgCompletionRate: string;
  };
  tasksPerUser: Array<{
    _id: string;
    email: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
  }>;
  tasksOverTime: Array<{
    _id: string;
    count: number;
  }>;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface NotificationOptions {
  variant?: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}