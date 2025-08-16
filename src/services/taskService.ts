import api from "./api";
import { Task, TasksResponse, Analytics } from "@/types";

export const taskService = {
  async getTasks(page = 1, limit = 10): Promise<TasksResponse> {
    const response = await api.get(`/tasks?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await api.post("/tasks", task);
    return response.data.data;
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTaskComplete(id: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data.data;
  },

  async getAnalytics(): Promise<Analytics> {
    const response = await api.get("/analytics");
    return response.data.data;
  },
};
