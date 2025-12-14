import { axiosInstance } from "@/lib/axiosInstance";

export const adminAiMenuService = {
  checkNeedRebuild: async (): Promise<boolean> => {
    const response = await axiosInstance.get<boolean>("/api/manager/ai-menu/need-rebuild");
    return response.data;
  },

  rebuild: async () => {
    const response = await axiosInstance.post("/api/manager/ai-menu/rebuild");
    return response.data;
  },
};