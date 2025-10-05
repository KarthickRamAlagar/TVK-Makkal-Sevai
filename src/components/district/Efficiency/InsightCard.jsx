import React from "react";

const InsightCard = ({ label, value, gradient }) => (
  <div
    className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-gradient-to-r ${gradient} text-white`}
  >
    <span className="text-lg md:text-xl font-semibold tracking-wide uppercase drop-shadow-sm">
      {label}
    </span>
    <span className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
      {value}
    </span>
  </div>
);

export default InsightCard;
