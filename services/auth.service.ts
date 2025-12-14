import { axiosInstance } from "@/lib/axiosInstance";
import { LoginFormData } from "@/lib/definitions";
import { AuthResponse, User } from "@/types/auth";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/api/Auth/login", data);
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await axiosInstance.get("/api/Auth/me");
    return res.data;
  },

  refreshToken: async (): Promise<void> => {
    const res = await axiosInstance.post("/api/Auth/refresh-token");
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/api/Auth/logout", {});
    } catch (error) {
      console.warn("Logout API failed", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    }
  },
};
