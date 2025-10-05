import React from "react";
import DistrictGlobe from "./DistrictGlobe";
import { useSelector } from "react-redux";
import { districtAuthorityGuidelines } from "@/constants/i18nConstants/districtAuthorityGuidelines";
import { districtGuidelines } from "@/constants/i18nConstants/districtGuidelines";
import { useTranslation } from "react-i18next";
import usePagination from "../../hooks/usePagination";
import PaginationControls from "../common/PaginationControls";

const DistrictDetails = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const district = useSelector((state) => state.user.district);

  const {
    currentPage,
    totalPages,
    pageItems: paginatedPoints,
    setPage,
  } = usePagination(districtGuidelines[lang], 5);

  return (
    <div
      className="
    bg-white/20 backdrop-blur-md rounded-2xl shadow-lg 
    w-full max-w-8xl mx-auto p-4 sm:p-6 md:p-8 mt-8 
    grid grid-cols-1 lg:grid-cols-12 gap-8
  "
    >
      {/* Left: Globe Section */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
        <DistrictGlobe />

        <h2 className="text-white text-2xl md:text-4xl font-bold leading-snug relative text-center">
          <span className="text-5xl text-white font-serif absolute -left-6 -top-2">
            “
          </span>
          Empower Your Region
            <span className="text-5xl text-white font-serif absolute -right-6 -bottom-2">
              ”
            </span>
        </h2>
      </div>

      {/* Right: Authority Details */}
      <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
        <div className="flex flex-wrap justify-center md:justify-start md:px-10 items-center text-red-600 font-bold text-xl sm:text-lg md:text-4xl">
          <span>
            {districtAuthorityGuidelines[lang].label.authorityDistrict}
          </span>
          <span className="text-white px-2 capitalize">
            {district || "Not Available"}
          </span>
        </div>

        <ul className="text-white/95 text-lg sm:text-lg md:text-2xl space-y-4 px-2 sm:px-6 md:px-8 list-none">
          {paginatedPoints.map((point, index) => (
            <li
              key={index}
              className="relative pl-6 font-semibold leading-relaxed
          before:content-[''] before:absolute before:left-0 before:top-2
          before:w-3 before:h-3 before:rounded-full before:bg-white before:border-2 before:border-blue-500"
              dangerouslySetInnerHTML={{ __html: point }}
            />
          ))}
        </ul>

        <div className="flex justify-center md:justify-start w-full">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="red"
          />
        </div>
      </div>
    </div>
  );
};

export default DistrictDetails;
