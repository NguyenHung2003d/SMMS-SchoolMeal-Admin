import React from "react";
import { SchoolRevenue } from "@/types/admin-school";
import { Edit, Trash2, FileCheck, Loader2 } from "lucide-react";

interface Props {
  revenues: SchoolRevenue[];
  isLoading: boolean;
  editingId: number | null;
  submittingId: number | null;
  onEdit: (revenue: SchoolRevenue) => void;
  onDelete: (id: number) => void;
}

export const RevenueList: React.FC<Props> = ({
  revenues,
  isLoading,
  editingId,
  submittingId,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (revenues.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-3 border border-dashed rounded-lg bg-gray-50">
        Chưa có hợp đồng nào được thêm cho trường này.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {revenues.map((revenue) => (
        <div
          key={revenue.schoolRevenueId}
          className="p-3 border rounded-lg bg-blue-50 flex items-start justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-800 truncate">
              Mã HĐ: {revenue.contractCode}
            </p>
            <p className="text-sm text-gray-600">
              Giá trị:{" "}
              <span className="font-medium text-orange-600">
                {revenue.revenueAmount.toLocaleString("vi-VN")} VNĐ
              </span>{" "}
              (Ngày ký:{" "}
              {new Date(revenue.revenueDate).toLocaleDateString("vi-VN")})
            </p>
            {revenue.contractFileUrl && (
              <a
                href={revenue.contractFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center mt-1"
              >
                <FileCheck size={14} className="mr-1" />
                Xem file đính kèm
              </a>
            )}
            {editingId === revenue.schoolRevenueId && (
              <p className="text-xs text-red-500 mt-1">Đang chỉnh sửa...</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              title="Chỉnh sửa hợp đồng"
              onClick={() => onEdit(revenue)}
              disabled={submittingId !== null || editingId !== null}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
            >
              <Edit size={16} />
            </button>
            <button
              title="Xóa hợp đồng"
              onClick={() => onDelete(revenue.schoolRevenueId)}
              disabled={submittingId !== null || editingId !== null}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
            >
              {submittingId === revenue.schoolRevenueId ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
