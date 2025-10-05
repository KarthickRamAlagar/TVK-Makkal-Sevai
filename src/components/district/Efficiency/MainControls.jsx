

import React from "react";
import EfficiencySection from "./EfficiencySection";
import AuthorityDetails from "./AuthorityDetails";
import AdditionalInsights from "./AdditionalInsights";

const MainControls = ({
  complaints,
  allComplaints,
  selectedRange,
  selectedStatus,
  setSelectedStatus,
  selectedDistrict,
  authorityData,
}) => {
  const normalizedDistrict = selectedDistrict?.trim().toLowerCase();

  console.log("📍 Selected District (raw):", selectedDistrict);
  console.log("🔡 Normalized District:", normalizedDistrict);
  console.log("🛡️ Authority Data:", authorityData);
  console.log("🧾 Complaints:", complaints);
  console.log("📦 All Complaints:", allComplaints);

  return (
    <div className="bg-white/20 rounded-2xl shadow-lg w-full max-w-8xl mx-auto mt-12 mb-12 px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EfficiencySection
          complaints={complaints}
          selectedRange={selectedRange}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        <AuthorityDetails
          authorityData={authorityData}
          selectedDistrict={selectedDistrict}
        />
      </div>
      <AdditionalInsights
        allComplaints={allComplaints}
        selectedStatus={selectedStatus}
      />
    </div>
  );
};

export default MainControls;
