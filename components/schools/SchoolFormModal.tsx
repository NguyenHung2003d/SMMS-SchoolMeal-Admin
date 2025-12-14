"use client";
import {
  CreateSchoolDto,
  SchoolDTO,
  SchoolRevenue,
  UpdateSchoolDto,
} from "@/types/admin-school";
import { X, Loader2, Plus } from "lucide-react"; // Import thêm icon Plus
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { adminSchoolRevenueService } from "@/services/adminRevenue.service";
import { SchoolGeneralInfo } from "./SchoolGeneralInfo";
import { ContractDataState, ContractInputFields } from "./ContractInputFields";
import { RevenueList } from "./RevenueList";

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    schoolData: CreateSchoolDto | UpdateSchoolDto,
    contractData?: any
  ) => Promise<void>;
  initialData?: SchoolDTO | null;
  isSubmitting: boolean;
  onContractAdd: (
    schoolId: string,
    data: any,
    file?: File | null
  ) => Promise<void>;
  onContractUpdate: (
    revenueId: number,
    data: any,
    file?: File | null
  ) => Promise<void>;
  onContractDelete: (revenueId: number) => Promise<void>;
}

interface ExtendedSchoolData extends CreateSchoolDto {
  managerIsActive?: boolean;
}

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  onContractAdd, // Destructure prop mới
  onContractUpdate,
  onContractDelete,
}: SchoolFormModalProps) {
  const [schoolData, setSchoolData] = useState<ExtendedSchoolData>({
    schoolName: "",
    contactEmail: "",
    hotline: "",
    schoolAddress: "",
    isActive: true,
    managerIsActive: true,
  });

  const [contractData, setContractData] = useState<ContractDataState>({
    hasContract: false,
    contractCode: "",
    revenueAmount: 0,
    revenueDate: new Date().toISOString().split("T")[0],
    contractNote: "",
    contractFile: null,
  });

  const [currentRevenues, setCurrentRevenues] = useState<SchoolRevenue[]>([]);
  const [isRevenueLoading, setIsRevenueLoading] = useState(false);

  const [editingRevenueId, setEditingRevenueId] = useState<number | null>(null);
  const [isAddingContract, setIsAddingContract] = useState(false);

  const [revenueSubmittingId, setRevenueSubmittingId] = useState<number | null>(
    null
  );

  const resetContractForm = () => {
    setContractData({
      hasContract: false,
      contractCode: "",
      revenueAmount: 0,
      revenueDate: new Date().toISOString().split("T")[0],
      contractNote: "",
      contractFile: null,
    });
    setEditingRevenueId(null);
    setIsAddingContract(false); // Reset trạng thái thêm mới
  };

  const fetchRevenues = useCallback(async (schoolId: string) => {
    if (!schoolId) return;
    setIsRevenueLoading(true);
    try {
      const data = await adminSchoolRevenueService.getBySchool(schoolId);
      setCurrentRevenues(data);
    } catch (error) {
      toast.error("Không thể tải danh sách hợp đồng.");
    } finally {
      setIsRevenueLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setSchoolData({
        schoolName: initialData.schoolName,
        contactEmail: initialData.contactEmail || "",
        hotline: initialData.hotline || "",
        schoolAddress: initialData.schoolAddress || "",
        isActive: initialData.isActive,
        managerIsActive: initialData.managerIsActive ?? true,
      });
      resetContractForm();
      fetchRevenues(initialData.schoolId);
    } else {
      setSchoolData({
        schoolName: "",
        contactEmail: "",
        hotline: "",
        schoolAddress: "",
        isActive: true,
        managerIsActive: true,
      });
      resetContractForm();
      setCurrentRevenues([]);
    }
  }, [initialData, isOpen, fetchRevenues]);

  if (!isOpen) return null;

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      schoolData,
      !initialData && contractData.hasContract ? contractData : undefined
    );
  };

  const handleStartAddContract = () => {
    resetContractForm();
    setIsAddingContract(true);
    setEditingRevenueId(null);
    setContractData((prev) => ({ ...prev, hasContract: true }));
  };

  const handleRevenueEditStart = (revenue: SchoolRevenue) => {
    setEditingRevenueId(revenue.schoolRevenueId);
    setIsAddingContract(false);
    setContractData({
      hasContract: true,
      contractCode: revenue.contractCode || "",
      revenueAmount: revenue.revenueAmount,
      revenueDate: revenue.revenueDate.split("T")[0],
      contractNote: revenue.contractNote || "",
      contractFile: null,
    });
  };

  const handleRevenueDelete = async (revenueId: number) => {
    if (!initialData) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này không?"))
      return;

    setRevenueSubmittingId(revenueId);
    try {
      await onContractDelete(revenueId);
      await fetchRevenues(initialData.schoolId);
      toast.success("Đã xóa hợp đồng thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa hợp đồng.");
    } finally {
      setRevenueSubmittingId(null);
    }
  };

  const handleRevenueUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRevenueId || !initialData) return;

    setRevenueSubmittingId(editingRevenueId);
    try {
      const updateDto = {
        revenueId: editingRevenueId,
        schoolId: initialData.schoolId,
        revenueDate: contractData.revenueDate,
        revenueAmount: contractData.revenueAmount,
        contractCode: contractData.contractCode,
        contractNote: contractData.contractNote,
      };

      await onContractUpdate(
        editingRevenueId,
        updateDto,
        contractData.contractFile
      );

      await fetchRevenues(initialData.schoolId);
      resetContractForm();
      toast.success("Cập nhật hợp đồng thành công!");
    } catch (error) {
      toast.error("Lỗi cập nhật hợp đồng.");
    } finally {
      setRevenueSubmittingId(null);
    }
  };

  const handleAddNewContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    setRevenueSubmittingId(-1);

    try {
      const newContractDto = {
        schoolId: initialData.schoolId,
        revenueDate: contractData.revenueDate,
        revenueAmount: contractData.revenueAmount,
        contractCode: contractData.contractCode,
        contractNote: contractData.contractNote,
      };

      await onContractAdd(
        initialData.schoolId,
        newContractDto,
        contractData.contractFile
      );

      await fetchRevenues(initialData.schoolId);
      resetContractForm();
      toast.success("Thêm hợp đồng mới thành công!");
    } catch (error) {
      toast.error("Lỗi khi thêm hợp đồng.");
    } finally {
      setRevenueSubmittingId(null);
    }
  };

  const isCreateMode = !initialData;
  const isEditMode = !!initialData;
  const isRevenueEditing = isEditMode && editingRevenueId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b shrink-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Cập nhật thông tin trường" : "Thêm trường học mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form
            id="school-form"
            onSubmit={handleSchoolSubmit}
            className="space-y-6"
          >
            <SchoolGeneralInfo
              data={schoolData}
              onChange={setSchoolData}
              isEditMode={isEditMode}
            />

            {isCreateMode && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 border-l-4 border-blue-500 pl-2">
                    Thông tin hợp đồng (Tùy chọn)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <input
                      id="hasContract"
                      type="checkbox"
                      checked={contractData.hasContract}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          hasContract: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hasContract"
                      className="text-sm font-medium text-blue-600 cursor-pointer"
                    >
                      Thêm hợp đồng ngay
                    </label>
                  </div>
                </div>
                {contractData.hasContract && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100 animate-in slide-in-from-top-2">
                    <ContractInputFields
                      data={contractData}
                      onChange={setContractData}
                      required={contractData.hasContract}
                    />
                  </div>
                )}
              </div>
            )}
          </form>

          {isEditMode && (
            <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 border-l-4 border-blue-500 pl-2">
                  Hợp đồng hiện tại
                </h3>
                {!isAddingContract && !isRevenueEditing && (
                  <button
                    type="button"
                    onClick={handleStartAddContract}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <Plus size={16} /> Thêm hợp đồng
                  </button>
                )}
              </div>

              {!isAddingContract && !isRevenueEditing && (
                <RevenueList
                  revenues={currentRevenues}
                  isLoading={isRevenueLoading}
                  editingId={editingRevenueId}
                  submittingId={revenueSubmittingId}
                  onEdit={handleRevenueEditStart}
                  onDelete={handleRevenueDelete}
                />
              )}

              {isRevenueEditing && (
                <form
                  onSubmit={handleRevenueUpdateSubmit}
                  className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 space-y-4 animate-in fade-in slide-in-from-top-4"
                >
                  <h4 className="font-bold text-base text-blue-800">
                    Cập nhật Hợp đồng #{editingRevenueId}
                  </h4>
                  <ContractInputFields
                    data={contractData}
                    onChange={setContractData}
                    required={true}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetContractForm}
                      className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                      disabled={revenueSubmittingId === editingRevenueId}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 text-sm flex items-center"
                      disabled={revenueSubmittingId === editingRevenueId}
                    >
                      {revenueSubmittingId === editingRevenueId ? (
                        <Loader2 size={16} className="animate-spin mr-1" />
                      ) : (
                        "Lưu Hợp đồng"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {isAddingContract && (
                <form
                  onSubmit={handleAddNewContractSubmit}
                  className="mt-4 p-4 border-2 border-dashed border-green-400 rounded-xl bg-green-50 space-y-4 animate-in fade-in slide-in-from-top-4"
                >
                  <h4 className="font-bold text-base text-green-800 flex items-center gap-2">
                    <Plus size={16} /> Thêm Hợp đồng mới
                  </h4>
                  <ContractInputFields
                    data={contractData}
                    onChange={setContractData}
                    required={true}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetContractForm}
                      className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-white bg-green-600 rounded-lg hover:bg-green-700 text-sm flex items-center"
                      disabled={revenueSubmittingId === -1}
                    >
                      {revenueSubmittingId === -1 ? (
                        <Loader2 size={16} className="animate-spin mr-1" />
                      ) : (
                        "Tạo mới Hợp đồng"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {(isAddingContract || isRevenueEditing) && (
                <div className="opacity-40 pointer-events-none grayscale">
                  <RevenueList
                    revenues={currentRevenues}
                    isLoading={false}
                    editingId={null}
                    submittingId={null}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-xl shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            form="school-form"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition disabled:opacity-70 flex items-center shadow-md font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Đang lưu...
              </>
            ) : isEditMode ? (
              "Lưu thông tin trường"
            ) : contractData.hasContract ? (
              "Lưu Trường & HĐ"
            ) : (
              "Thêm mới trường"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
