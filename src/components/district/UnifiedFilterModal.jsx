import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import DepartmentAutocomplete from "../common/DepartmentAutocomplete";

const UnifiedFilterModal = ({
  isOpen,
  onClose,
  filters = {},
  setFilter,
  resetFilter,
  districtName = "",
}) => {
  const [tempFilters, setTempFilters] = useState({
    status: Array.isArray(filters.status)
      ? filters.status[0] || ""
      : filters.status || "",
    feedback: Array.isArray(filters.feedback)
      ? filters.feedback[0] || ""
      : filters.feedback || "",
    taluk: Array.isArray(filters.taluk)
      ? filters.taluk[0] || ""
      : filters.taluk || "",
    department: Array.isArray(filters.department)
      ? filters.department[0] || null
      : filters.department || null,
    dateCode: "",
    customFrom: "",
    customTo: "",
  });

  useEffect(() => {
    if (isOpen) {
      setTempFilters({
        status: Array.isArray(filters.status)
          ? filters.status[0] || ""
          : filters.status || "",
        feedback: Array.isArray(filters.feedback)
          ? filters.feedback[0] || ""
          : filters.feedback || "",
        taluk: Array.isArray(filters.taluk)
          ? filters.taluk[0] || ""
          : filters.taluk || "",
        department: Array.isArray(filters.department)
          ? filters.department[0] || null
          : filters.department || null,
        dateCode: "",
        customFrom: "",
        customTo: "",
      });
    }
  }, [isOpen, JSON.stringify(filters)]);

  if (!isOpen) return null;

  const statuses = ["Appealed", "Pending", "Resolved", "Re-Appealed"];
  const feedbacks = ["Satisfactory", "Not Satisfactory"];
  const taluks = [
    "madurai North",
    "madurai South",
    "madurai East",
    "madurai West",
  ];
  const dateOptions = [
    { label: "Last 10 Days", code: "10_days" },
    { label: "Last 15 Days", code: "15_days" },
    { label: "Last 1 Month", code: "1_month" },
    { label: "Custom Range", code: "custom" },
  ];

  const handleConfirm = () => {
    setFilter("status", tempFilters.status ? [tempFilters.status] : []);
    setFilter("feedback", tempFilters.feedback ? [tempFilters.feedback] : []);
    setFilter("taluk", tempFilters.taluk ? [tempFilters.taluk.trim()] : []);
    setFilter(
      "department",
      tempFilters.department ? [tempFilters.department] : []
    );

    if (tempFilters.dateCode === "custom") {
      setFilter("dateRange", {
        from: tempFilters.customFrom,
        to: tempFilters.customTo,
        label: "Custom Range",
      });
    } else {
      const label = dateOptions.find(
        (opt) => opt.code === tempFilters.dateCode
      )?.label;
      setFilter("dateRange", label ? { label } : null);
    }

    onClose();
  };

  const handleResetAll = () => {
    resetFilter("status");
    resetFilter("feedback");
    resetFilter("taluk");
    resetFilter("department");
    resetFilter("dateRange");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4 py-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-red-500 text-white rounded-lg hover:text-yellow-300"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-green-700">Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-gray-700"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={tempFilters.status === status}
                  onClick={() => {
                    if (tempFilters.status === status) {
                      resetFilter("status");
                      onClose();
                    } else {
                      setTempFilters((prev) => ({ ...prev, status }));
                    }
                  }}
                  className="w-5 h-5 accent-green-600"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-pink-700">Feedback</h3>
          <div className="grid grid-cols-2 gap-2">
            {feedbacks.map((fb) => (
              <label key={fb} className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="feedback"
                  value={fb}
                  checked={tempFilters.feedback === fb}
                  onClick={() => {
                    if (tempFilters.feedback === fb) {
                      resetFilter("feedback");
                      onClose();
                    } else {
                      setTempFilters((prev) => ({ ...prev, feedback: fb }));
                    }
                  }}
                  className="w-5 h-5 accent-pink-600"
                />
                <span>{fb}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Taluk */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-blue-700">Taluk</h3>
          <div className="grid grid-cols-2 gap-2">
            {taluks.map((taluk) => (
              <label
                key={taluk}
                className="flex items-center gap-2 text-gray-700"
              >
                <input
                  type="radio"
                  name="taluk"
                  value={taluk}
                  checked={tempFilters.taluk === taluk}
                  onClick={() => {
                    if (tempFilters.taluk === taluk) {
                      resetFilter("taluk");
                      onClose();
                    } else {
                      setTempFilters((prev) => ({ ...prev, taluk }));
                    }
                  }}
                  className="w-5 h-5 accent-blue-600"
                />
                <span>{taluk}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-purple-700">Date Range</h3>
          <div className="grid grid-cols-2 gap-2">
            {dateOptions.map((opt) => (
              <label
                key={opt.code}
                className="flex items-center gap-2 text-gray-700"
              >
                <input
                  type="radio"
                  name="dateRange"
                  value={opt.code}
                  checked={tempFilters.dateCode === opt.code}
                  onClick={() => {
                    if (tempFilters.dateCode === opt.code) {
                      resetFilter("dateRange");
                      onClose();
                    } else {
                      setTempFilters((prev) => ({
                        ...prev,
                        dateCode: opt.code,
                        customFrom: "",
                        customTo: "",
                      }));
                    }
                  }}
                  className="w-5 h-5 accent-purple-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          {tempFilters.dateCode === "custom" && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-gray-600 font-medium">From</label>
              <input
                type="date"
                value={tempFilters.customFrom}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    customFrom: e.target.value,
                  }))
                }
                className="border-2 border-purple-500 rounded-xl px-4 py-2 shadow-md"
              />
              <label className="text-gray-600 font-medium">To</label>
              <input
                type="date"
                value={tempFilters.customTo}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    customTo: e.target.value,
                  }))
                }
                className="border-2 border-purple-500 rounded-xl px-4 py-2 shadow-md"
              />
            </div>
          )}
        </div>

        {/* Department */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-yellow-700">Department</h3>
          <DepartmentAutocomplete
            value={tempFilters.department}
            onChange={(option) =>
              setTempFilters((prev) => ({ ...prev, department: option }))
            }
            placeholder="Search department..."
            getOptionLabel={(option) => option?.label || option?.value || ""}
            styles={{
              menu: (base) => ({
                ...base,
                zIndex: 60,
              }),
            }}
          />
        </div>

        {/* Reset & Confirm Buttons */}
        <button
          onClick={handleResetAll}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200"
        >
          Reset All Filters
        </button>

        <button
          onClick={handleConfirm}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default UnifiedFilterModal;
