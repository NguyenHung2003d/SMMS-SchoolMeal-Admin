import React from "react";
import { SchoolDTO } from "@/types/admin-school";
import {
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";

interface SchoolCardProps {
  school: SchoolDTO;
  togglingId: string | null;
  onToggleStatus: (schoolId: string, currentStatus: boolean) => void;
  onOpenEditModal: (school: SchoolDTO) => void;
  onOpenDeleteModal: (id: string) => void;
  onToggleManagerStatus: (
    schoolId: string,
    currentManagerStatus: boolean
  ) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onOpenEditModal,
  onOpenDeleteModal,
  onToggleManagerStatus,
}) => {
  const isManagerActive = school.managerIsActive ?? true;

  return (
    <div
      key={school.schoolId}
      className={`group bg-white rounded-xl shadow-sm border transition-all duration-300 p-5 relative flex flex-col ${
        school.isActive
          ? "border-gray-100 hover:shadow-lg hover:border-orange-200"
          : "border-red-100 bg-red-50/30 opacity-80 hover:opacity-100"
      }`}
    >
      <div
        className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${
          school.isActive
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-600 border-red-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            school.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {school.isActive ? "Hoạt động" : "Đã khóa"}
      </div>

      <div className="mb-4 pr-20">
        <h3
          className="font-bold text-lg text-gray-800 line-clamp-1"
          title={school.schoolName}
        >
          {school.schoolName}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-gray-500">
          <div className="flex items-start">
            <MapPin
              size={14}
              className="mr-2 text-orange-500 mt-0.5 shrink-0"
            />
            <span className="line-clamp-2">
              {school.schoolAddress || "Chưa cập nhật địa chỉ"}
            </span>
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2 text-orange-500 shrink-0" />
            <span>{school.hotline || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Mail size={14} className="mr-2 text-orange-500 shrink-0" />
            <span className="truncate">{school.contactEmail || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Users size={16} className="mr-1.5 text-blue-500" />
          <span>{school.studentCount} học sinh</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title={
              isManagerActive ? "Khóa tài khoản Manager" : "Kích hoạt Manager"
            }
            onClick={() =>
              onToggleManagerStatus(school.schoolId, isManagerActive)
            }
            className={`transition-colors h-8 w-8 ${
              isManagerActive
                ? "text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            <UserCog size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Chỉnh sửa thông tin"
            onClick={() => onOpenEditModal(school)}
            className="text-gray-500 hover:text-orange-500 hover:bg-orange-50 h-8 w-8"
          >
            <Edit size={16} />
          </Button>

          {school.isActive ? (
            <Button
              variant="ghost"
              size="icon"
              title="Vô hiệu hóa trường học"
              onClick={() => onOpenDeleteModal(school.schoolId)}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-8 w-8"
            >
              <Trash2 size={16} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="text-gray-300 cursor-not-allowed h-8 w-8"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;
