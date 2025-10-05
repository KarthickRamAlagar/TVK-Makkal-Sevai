import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import DepartmentAutocomplete from "../common/DepartmentAutocomplete";

const FilterDepartment = ({
  isOpen,
  onClose,
  selectedDepartment,
  setSelectedDepartment,
  onReset,
}) => {
  const [tempDepartment, setTempDepartment] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTempDepartment(selectedDepartment || null);
    }
  }, [isOpen, selectedDepartment]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (tempDepartment) {
      setSelectedDepartment(tempDepartment);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl h-[45vh] p-6 flex flex-col gap-6 relative overflow-y-auto z-[60]">
        {/* Close Button */}
        <button
          className="absolute top-6 right-4 bg-red-500 text-white rounded-lg hover:text-yellow-300 z-[70]"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Header with Reset */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-pink-500 bg-clip-text text-transparent">
            Select Department
          </h2>
        </div>

        {/* Autocomplete */}
        <div className="relative z-[60]">
          <DepartmentAutocomplete
            value={tempDepartment}
            onChange={(option) => setTempDepartment(option)}
            placeholder="Search department..."
            menuPortalTarget={null}
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

        {/* Confirm Button */}

        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            disabled={!tempDepartment}
            className={`flex-1 h-12 rounded-xl font-semibold shadow-md transition duration-200 text-center ${
              tempDepartment
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Selection
          </button>

          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            disabled={!tempDepartment}
            className={`flex-1 h-12 rounded-xl font-semibold shadow-md transition duration-200 text-center ${
              tempDepartment
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDepartment;
