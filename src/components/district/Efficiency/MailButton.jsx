"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import domtoimage from "dom-to-image";
import { sendEfficiencyReport } from "@/utils/EfficiencyReportSending";

const MailButton = ({
  authorityData,
  allComplaints,
  selectedRange,
  setShowAlert,
  setAlertMessage,
}) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateDonutChartImage = async () => {
    const chartNode = document.getElementById("donut-chart");
    if (!chartNode) {
      console.warn("⚠️ Donut chart element not found");
      return null;
    }
    try {
      const dataUrl = await domtoimage.toPng(chartNode);
      return dataUrl;
    } catch (error) {
      console.error("❌ Chart image generation failed:", error);
      return null;
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const imageBase64 = await generateDonutChartImage();

      await sendEfficiencyReport({
        toEmail: "karthickramalagar@gmail.com",
        authorityData,
        allComplaints,
        selectedRange,
        donutChartImageBase64: imageBase64,
      });

      setAlertMessage("Efficiency report sent successfully 🎉");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Failed to send efficiency report ❌");
      setShowAlert(true);
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
          Send Efficiency Report
        </span>
      </motion.div>

      {/* Button */}
      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        disabled={loading}
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-red-600 shadow-lg bg-white ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
        }`}
      >
        <Mail className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default MailButton;
