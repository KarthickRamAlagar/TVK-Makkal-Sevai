import React, { useState } from "react";
import { X } from "lucide-react";

const DateFilterModal = ({
  isOpen,
  onClose,
  selectedDateRange,
  setSelectedDateRange,
  onReset,
}) => {
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [selectedOptionCode, setSelectedOptionCode] = useState("");

  if (!isOpen) return null;

  const options = [
    { label: "Last 10 Days", code: "10_days" },
    { label: "Last 15 Days", code: "15_days" },
    { label: "Last 1 Month", code: "1_month" },
    { label: "Custom Range", code: "custom" },
  ];

  const handleConfirm = () => {
    if (selectedOptionCode === "custom") {
      const inclusiveToDate = new Date(customToDate);
      inclusiveToDate.setHours(23, 59, 59, 999); // Ensure full day is included

      setSelectedDateRange({
        from: customFromDate,
        to: inclusiveToDate.toISOString(),
        label: "Custom Range",
      });
    } else {
      const label = options.find(
        (opt) => opt.code === selectedOptionCode
      )?.label;
      setSelectedDateRange(label || "");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 flex flex-col gap-6 relative">
        <button
          className="absolute top-6 right-4 bg-red-500 text-white rounded-lg hover:text-yellow-300"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Select Date Range
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <label
              key={option.code}
              className="flex items-center gap-2 text-gray-700 text-lg"
            >
              <input
                type="radio"
                name="dateRange"
                value={option.code}
                checked={selectedOptionCode === option.code}
                onChange={() => setSelectedOptionCode(option.code)}
                className="w-6 h-6 accent-purple-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {/* Custom Range Inputs - Rendered Separately Below */}
        {selectedOptionCode === "custom" && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* From field */}
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 font-medium">From</label>
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="border-2 border-purple-500 rounded-xl px-4 py-2 shadow-md w-full"
                />
              </div>

              {/* To field */}
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 font-medium">To</label>
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="border-2 border-purple-500 rounded-xl px-4 py-2 shadow-md w-full"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-1 text-center">
              * Both start and end dates are inclusive
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition duration-200"
          >
            Confirm Selection
          </button>

          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterModal;
