import React from "react";

const STATUS_OPTIONS = [
  { label: "All", textColor: "text-gray-500", accentColor: "accent-gray-500" },
  {
    label: "Resolved",
    textColor: "text-green-600",
    accentColor: "accent-green-600",
  },
  {
    label: "Pending",
    textColor: "text-yellow-600",
    accentColor: "accent-yellow-500",
  },
  {
    label: "Rejected",
    textColor: "text-red-600",
    accentColor: "accent-red-600",
  },
  {
    label: "ReAppealed",
    textColor: "text-violet-600",
    accentColor: "accent-violet-600",
  },
];

const StatusFilter = ({ selectedStatus, setSelectedStatus }) => {
  return (
    <div className="w-full md:w-56 flex flex-col gap-5 md:ml-6 mt-6 md:mt-0">
      <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent uppercase">
        Status
      </h2>

      {/* Responsive Grid for md and below */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:flex-col">
        {STATUS_OPTIONS.map(({ label, textColor, accentColor }, index) => {
          const isLast = index === STATUS_OPTIONS.length - 1;
          const isOdd = STATUS_OPTIONS.length % 2 !== 0;

          return (
            <div
              key={label}
              className={`flex ${
                isLast && isOdd
                  ? "col-span-2 justify-center items-center"
                  : "justify-start items-center"
              }`}
            >
              <label className="inline-flex items-center gap-3 w-full min-h-[40px]">
                <input
                  type="radio"
                  name="statusFilter"
                  className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer ${accentColor}`}
                  checked={selectedStatus === label}
                  onChange={() => setSelectedStatus(label)}
                />
                <span
                  className={`text-lg sm:text-lg md:text-xl font-bold cursor-pointer ${textColor} leading-none whitespace-nowrap`}
                >
                  {label}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFilter;
