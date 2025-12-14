import React from "react";
import { CreateSchoolDto } from "@/types/admin-school";

interface Props {
  data: CreateSchoolDto & { managerIsActive?: boolean };
  onChange: (data: any) => void;
  isEditMode?: boolean;
}

export const SchoolGeneralInfo: React.FC<Props> = ({
  data,
  onChange,
  isEditMode = false,
}) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 border-l-4 border-orange-500 pl-2">
        Thông tin chung
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên trường <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          value={data.schoolName}
          onChange={(e) => handleChange("schoolName", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          placeholder="Nhập tên trường học..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email liên hệ
          </label>
          <input
            type="email"
            value={data.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hotline (Số đt quản lý)
          </label>
          <input
            type="text"
            value={data.hotline}
            onChange={(e) => handleChange("hotline", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Nhập số chưa đăng ký..."
          />
          <p className="text-xs text-gray-400 mt-1">
            Số điện thoại này sẽ được dùng để tạo tài khoản Admin trường.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ
        </label>
        <input
          type="text"
          value={data.schoolAddress}
          onChange={(e) => handleChange("schoolAddress", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-4">
        {isEditMode && (
          <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-100">
            <div>
              <span className="block text-sm font-bold text-gray-800">
                Tài khoản Manager
              </span>
              <span className="text-xs text-gray-500">
                Cho phép quản lý đăng nhập hệ thống
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={data.managerIsActive ?? true}
                onChange={(e) =>
                  handleChange("managerIsActive", e.target.checked)
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-600 min-w-[80px]">
                {data.managerIsActive ? "Cho phép" : "Đã khóa"}
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
