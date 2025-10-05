

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDistrictFromEmail, getRoleFromEmail } from "@/utils/helpers";

const EfficiencyNavigateButton = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { districtName } = useParams(); // fallback from route
  // const email = useSelector((state) => state.auth?.email); // adjust if needed
  const email = useSelector((state) => state.user?.email);

  const district = getDistrictFromEmail(email) || districtName;
  const role = getRoleFromEmail(email);

  const handleClick = () => {
    if (district) {
      localStorage.setItem("selectedDistrict", district);
      localStorage.setItem("authorityRole", role);
      navigate(`/authorityEfficiency/${district}`);
    } else {
      console.warn("⚠️ No district found for navigation.");
    }
  };

  return (
    <div className="w-full flex justify-end mt-3 mb-6 relative">
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute right-16 flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-2 z-10"
      >
        <img
          src="/assets/flag.jpg"
          alt="Efficiency"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
          Get Your Efficiency
        </span>
      </motion.div>

      {/* Button */}
      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-14 h-14 flex items-center justify-center rounded-full font-bold text-white shadow-lg bg-green-600 hover:bg-green-700"
      >
        <TrendingUp className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default EfficiencyNavigateButton;
