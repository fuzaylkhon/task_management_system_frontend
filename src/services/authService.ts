import api from "./api";
import { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
