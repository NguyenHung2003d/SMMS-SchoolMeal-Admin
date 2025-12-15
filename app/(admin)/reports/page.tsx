"use client";
import { useEffect, useMemo, useState } from "react";
import ReportFilterBar from "@/components/reports/ReportFilterBar";
import {
  FinanceStatsChart,
  UserStatsChart,
} from "@/components/reports/ReportCharts";
import {
  FinanceSummaryCard,
  UserSummaryCard,
} from "@/components/reports/SummaryCards";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { FinanceReportDto, UserReportDto } from "@/types/admin-report";
import { adminReportService } from "@/services/adminReport.service";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "finance">("users");
  const [loading, setLoading] = useState(true);

  const [userReports, setUserReports] = useState<UserReportDto[]>([]);
  const [financeReports, setFinanceReports] = useState<FinanceReportDto[]>([]);

  const [selectedSchool, setSelectedSchool] = useState<string>("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [userData, financeData] = await Promise.all([
        adminReportService.getAllUserReports(),
        adminReportService.getAllFinanceReports(),
      ]);
      setUserReports(userData);
      setFinanceReports(financeData);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const schoolOptions = useMemo(() => {
    const schools = userReports
      .map((u) => u.schoolName)
      .filter((name): name is string => !!name && name !== "Hệ thống");
    return Array.from(new Set(schools));
  }, [userReports]);

  useEffect(() => {
    const firstSchool = schoolOptions[0];
    if (firstSchool && !selectedSchool) {
      setSelectedSchool(firstSchool);
    }
  }, [schoolOptions, selectedSchool]);

  const processedUserChartData = useMemo(() => {
    if (!selectedSchool) return [];
    const schoolData = userReports.filter(
      (u) => u.schoolName === selectedSchool
    );

    const targetRoles = [
      { key: "Warden", label: "Giám thị (Warden)" },
      { key: "KitchenStaff", label: "Nhân viên bếp" },
      { key: "Parent", label: "Phụ huynh" },
    ];

    return targetRoles.map((role) => {
      const found = schoolData.find((d) => d.roleName === role.key);
      return {
        roleName: role.label,
        activeUsers: found ? found.activeUsers : 0,
        inactiveUsers: found ? found.inactiveUsers : 0,
        totalUsers: found ? found.totalUsers : 0,
      };
    });
  }, [userReports, selectedSchool]);

  const handleFilter = async () => {
    if (!fromDate && !toDate) {
      loadInitialData();
      return;
    }

    try {
      setLoading(true);
      if (activeTab === "users") {
        const data = await adminReportService.getUserReportsByFilter({
          fromDate: fromDate ? new Date(fromDate).toISOString() : null,
          toDate: toDate ? new Date(toDate).toISOString() : null,
          scope: "ToanHeThong",
        });
        setUserReports(data);
      } else {
        const data = await adminReportService.getFinanceReportsByFilter({
          fromDate: fromDate || null,
          toDate: toDate || null,
          scope: "TatCa",
        });
        setFinanceReports(data);
      }
      toast.success("Đã cập nhật dữ liệu báo cáo");
    } catch (error) {
      toast.error("Lỗi khi lọc dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = userReports.reduce(
    (acc, curr) => acc + curr.totalUsers,
    0
  );
  const totalActiveUsers = userReports.reduce(
    (acc, curr) => acc + curr.activeUsers,
    0
  );

  const totalRevenue = financeReports.reduce(
    (acc, curr) => acc + curr.totalRevenue,
    0
  );
  const totalTransactions = financeReports.reduce(
    (acc, curr) => acc + curr.revenueCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo thống kê</h1>
          <p className="text-gray-500 mt-1">
            Tổng hợp số liệu về người dùng và tài chính hệ thống
          </p>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "users"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Người dùng
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "finance"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tài chính
          </button>
        </div>

        <ReportFilterBar
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onFilter={handleFilter}
          isFinance={activeTab === "finance"}
          showSchoolFilter={activeTab === "users"}
          schoolOptions={schoolOptions}
          selectedSchool={selectedSchool}
          onSchoolChange={setSelectedSchool}
        />

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "users" ? (
              <>
                <UserSummaryCard
                  totalUsers={totalUsers}
                  activeUsers={totalActiveUsers}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2 w-full">
                    <UserStatsChart
                      data={processedUserChartData as any}
                      schoolName={selectedSchool}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">
                      Chi tiết tại trường
                    </h3>
                    {selectedSchool ? (
                      <ul className="space-y-4">
                        {processedUserChartData.map((report, idx) => (
                          <li key={idx} className="group">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-700 font-medium group-hover:text-orange-600 transition-colors">
                                {report.roleName}
                              </span>
                              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                Tổng: {report.totalUsers}
                              </span>
                            </div>
                            <div className="flex items-center text-sm gap-4 mt-1">
                              <div className="flex items-center text-green-600">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                                <span className="font-medium">
                                  {report.activeUsers} Active
                                </span>
                              </div>
                              <div className="flex items-center text-red-500">
                                <div className="w-2 h-2 rounded-full border border-red-500 mr-1.5 bg-white"></div>
                                <span className="font-medium">
                                  {report.inactiveUsers} Inactive
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        Vui lòng chọn trường để xem chi tiết.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <FinanceSummaryCard
                  totalRevenue={totalRevenue}
                  transactionCount={totalTransactions}
                />
                <div className="mt-6">
                  <FinanceStatsChart data={financeReports} />
                </div>

                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Chi tiết doanh thu
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">
                            Tên trường
                          </th>
                          <th className="px-4 py-3 text-center">
                            Số giao dịch
                          </th>
                          <th className="px-4 py-3 text-right rounded-tr-lg">
                            Tổng doanh thu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {financeReports.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-orange-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {item.schoolName}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {item.revenueCount}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-orange-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.totalRevenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
