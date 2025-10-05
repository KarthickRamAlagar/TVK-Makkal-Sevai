import React from "react";
import { useTranslation } from "react-i18next";
import { efficiencyTranslations } from "@/constants/i18nConstants/efficiencyTranslations";

const EfficiencyTagline = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  return (
    <div className="rounded-2xl shadow-sm w-full max-w-8xl h-32 flex justify-center items-center mt-12 px-10 py-6">
      <h1
        className="text-3xl sm:text-3xl md:text-6xl font-extrabold text-center tracking-normal"
        style={{
          WebkitTextStroke: "1px white",
          color: "red",
          fontFamily: "serif",
        }}
      >
        {efficiencyTranslations[lang].efficiencyTagline}
      </h1>
    </div>
  );
};

export default EfficiencyTagline;
