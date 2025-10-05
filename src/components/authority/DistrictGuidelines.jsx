// components/DistrictGuidelines.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";
import { districtAuthorityGuidelines } from "../../constants/i18nConstants/districtAuthorityGuidelines";
import PaginationControls from "../common/PaginationControls";
import usePagination from "../../hooks/usePagination";

const DistrictGuidelines = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const labels =
    districtAuthorityGuidelines[lang]?.labels ||
    districtAuthorityGuidelines.en.labels;

  const fullPoints =
    districtAuthorityGuidelines[lang]?.points ||
    districtAuthorityGuidelines.en.points;

  const mobilePoints =
    districtAuthorityGuidelines[lang]?.mobileGuidelines ||
    districtAuthorityGuidelines.en.mobileGuidelines;

  const [isMobile, setIsMobile] = useState(false);

  // 🧠 Responsive detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activePoints = isMobile ? mobilePoints : fullPoints;

  const {
    currentPage,
    totalPages,
    pageItems: paginatedPoints,
    setPage,
  } = usePagination(activePoints, 4); // Show 4 points per page

  const district = useSelector((state) => state.user.district);

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl flex flex-col p-8 mt-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
        <h2 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3 md:gap-2">
          <img
            src="/assets/flag.jpg"
            alt="flag"
            className="w-10 h-10 object-contain mt-1"
          />
          {labels.title}
        </h2>

        {/* District Display */}
        <div className="flex items-center text-red-600 font-bold text-lg md:text-3xl xl:pr-24">
          <span className="">
            {districtAuthorityGuidelines[lang].label.authorityDistrict}
          </span>
          <span className="text-white px-2 -py-5 capitalize">
            {district || "Not Available"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-white w-7 h-7" />
            <h3 className="text-white text-xl sm:text-xl md:text-2xl font-bold">
              {labels.subheading}
            </h3>
          </div>

          {/* Paginated Guidelines */}

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

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="red"
          />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <img
            src="/assets/entry_image.png"
            alt="District Guidelines"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg max-h-81 object-contain xl:-mt-16"
          />
          <h2 className="text-white text-2xl md:text-4xl font-bold leading-snug relative">
            <span className="text-5xl text-white font-serif absolute -left-6 -top-2">
              “
            </span>
            Serve with Transparency & Justice
            <span className="text-5xl text-white font-serif absolute -right-6 -bottom-2">
              ”
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DistrictGuidelines;
