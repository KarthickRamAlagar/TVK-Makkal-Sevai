import React, { useState } from "react";
import { X } from "lucide-react";
import DistrictAutocomplete from "../common/DistrictAutocomplete";
import { DISTRICTS } from "../../constants/districts";

const SearchModal = ({
  isOpen,
  onClose,
  selectedDistrict,
  setSelectedDistrict,
}) => {
  const [localDistrict, setLocalDistrict] = useState(selectedDistrict || "");

  if (!isOpen) return null;

  const handleDistrictSelect = (e) => {
    const { name, value } = e?.target || e;
    if (typeof value === "string") {
      setLocalDistrict(value);
      setSelectedDistrict(value);
      onClose();
    } else {
      console.warn("Invalid district selection:", e);
    }
  };

  const handleClearFilter = () => {
    setLocalDistrict("");
    setSelectedDistrict("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] w-full max-w-2xl p-6 flex flex-col gap-6 relative">
        {/* ❌ Close Button */}
        <button
          className="absolute top-6 right-4 hover:text-yellow-300 bg-red-500 rounded-lg text-white"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* 🔍 Title */}
        <h2 className="text-xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-400 bg-clip-text text-transparent">
          Search District
        </h2>

        {/* 🧠 Autocomplete Input */}
        <DistrictAutocomplete
          value={localDistrict}
          onChange={handleDistrictSelect}
          options={DISTRICTS}
          name="district"
          placeholder="Select your district"
        />

        {/* 🧹 Clear Filter Button */}
        <button
          onClick={handleClearFilter}
          className="mt-4 self-end bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
