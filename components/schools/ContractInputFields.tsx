import React from "react";
import { FileCheck } from "lucide-react";

export interface ContractDataState {
  hasContract: boolean;
  contractCode: string;
  revenueAmount: number;
  revenueDate: string;
  contractNote: string;
  contractFile: File | null;
}

interface Props {
  data: ContractDataState;
  onChange: (data: ContractDataState) => void;
  required?: boolean;
}

export const ContractInputFields: React.FC<Props> = ({
  data,
  onChange,
  required = false,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({ ...data, contractFile: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Mã hợp đồng <span className="text-red-500">*</span>
          </label>
          <input
            required={required}
            type="text"
            className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
            value={data.contractCode}
            onChange={(e) =>
              onChange({ ...data, contractCode: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Giá trị (VNĐ) <span className="text-red-500">*</span>
          </label>
          <input
            required={required}
            type="number"
            min={0}
            className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
            value={data.revenueAmount}
            onChange={(e) =>
              onChange({ ...data, revenueAmount: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Ngày ký
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
            value={data.revenueDate}
            onChange={(e) => onChange({ ...data, revenueDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            File đính kèm
          </label>
          <label className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-blue-300 rounded cursor-pointer bg-white hover:bg-blue-50 text-sm text-gray-600 transition">
            <input type="file" className="hidden" onChange={handleFileChange} />
            {data.contractFile ? (
              <span className="flex items-center gap-2 text-green-600 truncate">
                <FileCheck size={16} /> {data.contractFile.name}
              </span>
            ) : (
              <span className="text-gray-500">
                {data.contractFile === null ? "Chọn file..." : "Chọn file mới"}
              </span>
            )}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Ghi chú
        </label>
        <textarea
          rows={2}
          className="w-full px-3 py-2 border border-blue-200 rounded outline-none text-sm focus:border-blue-400"
          value={data.contractNote}
          onChange={(e) => onChange({ ...data, contractNote: e.target.value })}
        />
      </div>
    </div>
  );
};
