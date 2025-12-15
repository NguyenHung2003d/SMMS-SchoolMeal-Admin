"use client";
import { Search, School, ChevronDown } from "lucide-react";

interface ReportFilterBarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFilter: () => void;
  isFinance?: boolean;
  showSchoolFilter?: boolean;
  schoolOptions?: string[];
  selectedSchool?: string;
  onSchoolChange?: (val: string) => void;
}

export default function ReportFilterBar({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onFilter,
  showSchoolFilter = false,
  schoolOptions = [],
  selectedSchool = "",
  onSchoolChange = () => {},
}: ReportFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end mb-6">
      {showSchoolFilter && (
        <div className="min-w-[250px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chọn trường
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-hover:text-orange-500 transition-colors">
              <School size={16} />
            </div>
            <select
              value={selectedSchool}
              onChange={(e) => onSchoolChange(e.target.value)}
              className="block w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm appearance-none cursor-pointer hover:border-orange-300 h-[38px]"
              disabled={schoolOptions.length === 0}
            >
              {schoolOptions.length === 0 && (
                <option value="">Đang tải...</option>
              )}
              {schoolOptions.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Từ ngày
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none h-[38px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đến ngày
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none h-[38px]"
        />
      </div>

      <button
        onClick={onFilter}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-sm h-[38px]"
      >
        <Search size={16} />
        Lọc
      </button>
    </div>
  );
}
