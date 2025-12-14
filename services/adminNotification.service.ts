import { axiosInstance } from "@/lib/axiosInstance";
import {
  CreateNotificationDto,
  NotificationDetailDto,
} from "@/types/admin-notification";
import { NotificationDto } from "@/types/notification";

export const adminNotificationService = {
  getHistory: async (): Promise<NotificationDto[]> => {
    const res = await axiosInstance.get("/api/Notifications/history");
    return res.data;
  },

  getById: async (id: number): Promise<NotificationDetailDto> => {
    const res = await axiosInstance.get(`/api/Notifications/${id}`);
    return res.data;
  },

  create: async (dto: CreateNotificationDto): Promise<any> => {
    const res = await axiosInstance.post("/api/Notifications", dto);
    return res.data;
  },
};
