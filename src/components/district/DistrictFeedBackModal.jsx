//DistrictFeedBackModal.jsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const FeedbackModal = ({
  isOpen,
  onClose,
  selectedFeedback,
  setSelectedFeedback,
  onReset,
}) => {
  const [tempFeedback, setTempFeedback] = useState("");

  useEffect(() => {
    if (isOpen) setTempFeedback(selectedFeedback || "");
  }, [isOpen, selectedFeedback]);

  if (!isOpen) return null;

  const options = ["Satisfactory", "Not Satisfactory"];

  const handleConfirm = () => {
    setSelectedFeedback(tempFeedback);
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
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-yellow-400 bg-clip-text text-transparent">
            Select User Feedback
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-gray-700 text-lg"
            >
              <input
                type="radio"
                name="feedback"
                value={option}
                checked={tempFeedback === option}
                onChange={() => setTempFeedback(option)}
                className="w-6 h-6 accent-pink-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            disabled={!tempFeedback}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempFeedback
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
            disabled={!tempFeedback}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempFeedback
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

export default FeedbackModal;
