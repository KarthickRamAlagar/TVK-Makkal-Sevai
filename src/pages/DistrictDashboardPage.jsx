import React from "react";
import { useParams } from "react-router-dom";
import { useDistrictFilters } from "@/hooks/useDistrictFilters";
import LandingTagline from "@/components/common/LandingTagline";
import DistrictDetails from "@/components/district/DistrictDetails";
import DistrictStatsCard from "@/components/district/DistrictStatsCard";
import DistrictFilters from "@/components/district/DistrictFilters";
import DistrictComplaintDashboardTable from "@/components/district/DistrictComplaintDashboardTable";

import EfficiencyNavigateButton from "@/components/district/EfficiencyNavigateButton";

const DistrictDashboardPage = () => {
  const { districtName } = useParams();
  const {
    filters,
    setFilter,
    resetFilter,
    resetAll,
    getActiveFilters,
    isFilterActive,
  } = useDistrictFilters();

  const handleZipDownload = () => {};

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden px-4 md:px-8">
      <LandingTagline />
      <DistrictDetails />
      <DistrictStatsCard districtName={districtName} twoColOnMd={true} />
      <DistrictFilters
        filters={filters}
        setFilter={setFilter}
        resetFilter={resetFilter}
        districtName={districtName}
      />
      <DistrictComplaintDashboardTable
        filters={filters}
        handleZipDownload={handleZipDownload}
      />
      <EfficiencyNavigateButton />
    </div>
  );
};

export default DistrictDashboardPage;
