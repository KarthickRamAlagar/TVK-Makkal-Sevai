import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { COMPLAINT_STATUS_OPTIONS } from "@/constants/status";

const StatusModal = ({
  isOpen,
  onClose,
  selectedStatus,
  setSelectedStatus,
  onReset,
}) => {
  const [tempStatus, setTempStatus] = useState("");

  useEffect(() => {
    if (isOpen) setTempStatus(selectedStatus || "");
  }, [isOpen, selectedStatus]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setSelectedStatus(tempStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-6 right-4 bg-red-500 text-white rounded-lg hover:text-yellow-300"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Title */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-400 bg-clip-text text-transparent">
            Select Complaint Status
          </h2>
        </div>

        {/* Status Options */}
        <div className="grid grid-cols-2 gap-4">
          {COMPLAINT_STATUS_OPTIONS.map(({ label, value }) => (
            <label
              key={value}
              className="flex items-center gap-2 text-gray-700 text-lg"
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={tempStatus === value}
                onChange={() => setTempStatus(value)}
                className="w-6 h-6 accent-green-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            disabled={!tempStatus}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempStatus
                ? "bg-green-600 hover:bg-green-700 text-white"
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
            disabled={!tempStatus}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempStatus
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

export default StatusModal;
