"use client";
import { FinanceReportDto } from "@/types/admin-report";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface ProcessedUserChartData {
  roleName: string;
  activeUsers: number;
  inactiveUsers: number;
}

export function UserStatsChart({
  data,
  schoolName,
}: {
  data: ProcessedUserChartData[];
  schoolName?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Thống kê tài khoản
          </h3>
          {schoolName && (
            <p className="text-sm text-gray-500 mt-1">
              Tại trường:{" "}
              <span className="font-semibold text-orange-600">
                {schoolName}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="roleName"
              tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              cursor={{ fill: "#f8fafc" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: "20px" }}
              iconType="circle"
            />

            <Bar
              dataKey="activeUsers"
              name="Active"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              barSize={32}
              animationDuration={1500}
            />

            <Bar
              dataKey="inactiveUsers"
              name="Inactive"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
              barSize={32}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FinanceStatsChart({ data }: { data: FinanceReportDto[] }) {
  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Doanh thu theo Trường học
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="schoolName"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                  value
                )
              }
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar
              dataKey="totalRevenue"
              name="Tổng doanh thu"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
