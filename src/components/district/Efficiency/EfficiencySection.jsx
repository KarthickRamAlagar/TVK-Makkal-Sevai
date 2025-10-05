import React from "react";
import EfficiencyDonutChart from "./EfficiencyDonutChart";
import StatusFilter from "./StatusFilter";

const EfficiencySection = ({
  complaints,
  selectedRange,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center justify-between min-h-[300px]">
      {/* Chart Section */}
      <div className="flex-1 flex items-center justify-center" id="donut-chart">
        <EfficiencyDonutChart
          complaints={complaints}
          range={selectedRange}
          statusFilter={selectedStatus}
        />
      </div>

      {/* Status Filter */}
      <StatusFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus} // make sure setter is passed
      />
    </div>
  );
};

export default EfficiencySection;
