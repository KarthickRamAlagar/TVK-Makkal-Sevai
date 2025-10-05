import { roleModels } from "@/constants/RoleModelConfig";
import React from "react";
import { useTranslation } from "react-i18next";
const PoticalRoleModel = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Political Role Model Card Section */}
      <div className="flex justify-center items-center mt-12">
        <h1
          className="text-3xl sm:text-3xl md:text-4xl font-extrabold text-center text-red-600"
        
        >
          {t("sectionTitles.policyLeaders")}
        </h1>
      </div>

      {/* Grid / Flex */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 px-4 mb-10 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6">
        {roleModels.map((leader, index) => (
          <div
            key={index}
            className="bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center
                       w-[45%] sm:w-[40%] md:w-full"
          >
            <img
              src={leader.image}
              alt={leader.id}
              className="w-32 h-42 sm:w-40 sm:h-40 md:w-48 md:h-60 object-cover rounded-2xl drop-shadow-2xl"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default PoticalRoleModel;
