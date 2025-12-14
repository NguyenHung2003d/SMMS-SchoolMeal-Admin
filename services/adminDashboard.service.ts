import { axiosInstance } from "@/lib/axiosInstance";

export const adminDashboardService = {
  getOverview: async () => {
    const res = await axiosInstance.get("/api/admin/dashboard/overview");
    console.log("Dashboard Overview Data:", res.data);
    return res.data;
  },
};
