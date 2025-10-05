import React from "react";
import { X } from "lucide-react";
import DepartmentAutocomplete from "./DepartmentAutocomplete";

const DepartmentModal = ({
  isOpen,
  onClose,
  selectedDepartment,
  setSelectedDepartment,
}) => {
  if (!isOpen) return null;

  const handleChange = ({ value }) => {
    setSelectedDepartment(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] w-full max-w-2xl h-[45vh] p-6 flex flex-col gap-6 relative overflow-y-auto z-[60]">
        {/* Close Button */}
        <button
          className="absolute top-6 right-4 hover:text-yellow-300 bg-red-500 rounded-lg text-white z-[70]"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        <h2 className="text-xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-pink-500 bg-clip-text text-transparent">
          Select Department
        </h2>

        <div className="relative z-[60]">
          <DepartmentAutocomplete
            value={selectedDepartment}
            onChange={handleChange}
            placeholder="Search department..."
            menuPortalTarget={null} // if using react-select or similar
            menuPosition="absolute"
            menuShouldBlockScroll={true}
            styles={{
              menu: (base) => ({
                ...base,
                zIndex: 60,
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
