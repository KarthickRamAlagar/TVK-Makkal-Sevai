import React from "react";
import AppIntroCard from "@/components/user/AppIntroCard";
import StatisCard from "@/components/common/StatisCard";
import { appCardTranslations } from "../constants/i18nConstants/appCardTranslation";
import { useTranslation } from "react-i18next";
import Footer from "@/components/common/Footer";
import Form from "@/components/user/Form";

const Complaint = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const { title, description, points } = appCardTranslations[lang];

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden px-4 md:px-8">
      <StatisCard twoColOnMd={true} />
      <AppIntroCard
        title={title}
        paragraphs={[description]}
        points={points}
        imageSrc="/assets/B1.png"
        buttonText="உங்களுக்காக நான் வரேன்"
        buttonLink="/complaint"
        reverse={true}
        language={lang}
      />
      <Form />
      <Footer />
    </div>
  );
};

export default Complaint;
