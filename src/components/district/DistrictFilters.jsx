import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

import StatusModal from "../common/StatusModal";
import FeedbackModal from "./DistrictFeedBackModal";
import TalukModal from "./TalukModal";
import DateFilterModal from "./DateFilterModal";
import FilterDepartment from "./FilterDepartment";
import UnifiedFilterModal from "./UnifiedFilterModal";

const DistrictFilters = ({ filters, setFilter, resetFilter, districtName }) => {
  const isMobile = useIsMobile();

  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isTalukModalOpen, setIsTalukModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const filtersList = [
    { key: "status", label: "Status", open: () => setIsStatusModalOpen(true) },
    {
      key: "feedback",
      label: "Feedback",
      open: () => setIsFeedbackModalOpen(true),
    },
    { key: "taluk", label: "Taluk", open: () => setIsTalukModalOpen(true) },
    {
      key: "department",
      label: "Department",
      open: () => setIsDepartmentModalOpen(true),
    },
    { key: "dateRange", label: "Date", open: () => setIsDateModalOpen(true) },
  ];

  const handleFilterClick = (key) => {
    if (isMobile) {
      setIsUnifiedModalOpen(true);
    } else {
      const target = filtersList.find((f) => f.key === key);
      if (target) target.open();
    }
  };

  return (
    <div className="w-full max-w-8xl flex flex-col lg:flex-row items-center justify-between mt-8">
      {/* Mobile: Unified Modal Trigger */}
      {isMobile && (
        <div className="w-full bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-4">
          <button
            onClick={() => setIsUnifiedModalOpen(true)}
            className="w-full h-16 bg-white rounded-full shadow-md flex items-center justify-center gap-3 transition hover:shadow-lg hover:shadow-green-500/60"
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Filters (Status, Date, Feedback...)
            </span>
          </button>
        </div>
      )}

      {/* Desktop: Individual Filter Cards */}
      {!isMobile && (
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full flex flex-col lg:flex-row items-center justify-between p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {filtersList.map(({ key, label }) => (
              <Card
                key={key}
                onClick={() => handleFilterClick(key)}
                className="bg-white w-full h-16 rounded-full shadow-md flex items-center justify-center cursor-pointer transition hover:shadow-lg hover:shadow-green-500/60"
              >
                <CardContent className="p-0 flex items-center justify-center">
                  <h1 className="text-xl sm:text-xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-pink-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                    {label}
                    <ChevronDown className="w-5 h-5 text-yellow-600" />
                  </h1>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Modals */}
      {!isMobile && (
        <>
          <StatusModal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            selectedStatus={filters.status}
            setSelectedStatus={(value) => setFilter("status", value)}
            onReset={() => resetFilter("status")}
          />
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            selectedFeedback={filters.feedback}
            setSelectedFeedback={(value) => setFilter("feedback", value)}
            onReset={() => resetFilter("feedback")}
          />
          <TalukModal
            isOpen={isTalukModalOpen}
            onClose={() => setIsTalukModalOpen(false)}
            selectedTaluk={filters.taluk}
            setSelectedTaluk={(value) => setFilter("taluk", value)}
            onReset={() => resetFilter("taluk")}
            districtName={districtName}
          />
          <FilterDepartment
            isOpen={isDepartmentModalOpen}
            onClose={() => setIsDepartmentModalOpen(false)}
            selectedDepartment={filters.department}
            setSelectedDepartment={(value) => setFilter("department", value)}
            onReset={() => resetFilter("department")}
          />
          <DateFilterModal
            isOpen={isDateModalOpen}
            onClose={() => setIsDateModalOpen(false)}
            selectedDateRange={filters.dateRange}
            setSelectedDateRange={(value) => setFilter("dateRange", value)}
            onReset={() => resetFilter("dateRange")}
          />
        </>
      )}

      {/* Mobile: Unified Modal */}
      {isMobile && (
        <UnifiedFilterModal
          isOpen={isUnifiedModalOpen}
          onClose={() => setIsUnifiedModalOpen(false)}
          filters={filters} // ✅ pass full filters object
          setFilter={setFilter} // ✅ pass the generic setter
          resetFilter={resetFilter} // ✅ pass the generic resetter
          districtName={districtName}
        />
      )}
    </div>
  );
};

export default DistrictFilters;
