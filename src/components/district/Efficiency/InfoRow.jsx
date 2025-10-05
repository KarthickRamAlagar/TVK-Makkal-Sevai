import React from "react";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-bold whitespace-nowrap">
    <div className="flex items-center gap-2 text-red-600">
      {icon}
      <span>{label}:</span>
    </div>
    <div className="text-yellow-600 ml-4">{value}</div>
  </div>
);

export default InfoRow;
