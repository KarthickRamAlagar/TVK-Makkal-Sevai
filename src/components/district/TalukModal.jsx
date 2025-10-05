import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const TalukModal = ({
  isOpen,
  onClose,
  selectedTaluk,
  setSelectedTaluk,
  onReset,
  districtName = "",
}) => {
  const [tempTaluk, setTempTaluk] = useState("");

  useEffect(() => {
    if (isOpen) {
      const rawTaluk =
        typeof selectedTaluk === "string"
          ? selectedTaluk.replace(`${districtName.trim()} `, "")
          : "";
      setTempTaluk(rawTaluk);
    }
  }, [isOpen, selectedTaluk, districtName]);

  if (!isOpen) return null;

  const directions = ["North", "South", "East", "West"];
  const options = directions.map((dir) => dir); // raw values only
  const handleConfirm = () => {
    setSelectedTaluk(tempTaluk.trim().toLowerCase()); // just "east", "north", etc.
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
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-400 bg-clip-text text-transparent">
            Select Taluk
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((taluk) => (
            <label
              key={taluk}
              className="flex items-center gap-2 text-gray-700 text-lg"
            >
              <input
                type="radio"
                name="taluk"
                value={taluk}
                checked={tempTaluk === taluk}
                onChange={() => setTempTaluk(taluk)}
                className="w-6 h-6 accent-green-600"
              />
              <span>{`${districtName.trim()} ${taluk}`}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            disabled={!tempTaluk}
            className={`flex-1 h-12 rounded-xl font-semibold shadow-md transition text-center ${
              tempTaluk
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
            disabled={!tempTaluk}
            className={`flex-1 h-12 rounded-xl font-semibold shadow-md transition text-center ${
              tempTaluk
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

export default TalukModal;
