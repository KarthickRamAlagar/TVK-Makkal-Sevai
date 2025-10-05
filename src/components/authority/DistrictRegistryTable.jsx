import React, { useMemo, useState } from "react";
import DistrictComplaintTable from "./DistrictComplaintTable";
import PaginationControls from "../common/PaginationControls";
import Alert from "../common/Alert";
import SearchModal from "./SearchModal";
import SecurityRowModal from "./SecurityRowModal";

import { useTranslation } from "react-i18next";
import { userNotificationsTranslations } from "../../constants/i18nConstants/userNotificationsTranslations";
import { getDistrictComplaintTableColumns } from "../../constants/getDistrictComplaintTableColumns";
import { DISTRICTS } from "../../constants/districts";
import usePagination from "../../hooks/usePagination";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isToday } from "@/utils/helpers";

const DistrictRegistryTable = () => {
  const navigate = useNavigate();
  const proofRegistry = useSelector((state) => state.proofRegistry);
  const districtRegistry = useSelector((state) => state.districtRegistry);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [clickedDistrict, setClickedDistrict] = useState("");

  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const labels =
    userNotificationsTranslations[lang]?.labels ||
    userNotificationsTranslations.en.labels;

  const handleRowClick = (row) => {
    setClickedDistrict(row.districtName);
    setIsSecurityModalOpen(true);
  };

  const handleSecuritySuccess = (districtName) => {
    setAlertMessage(`Access granted to: ${districtName}`);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate(`/authority/${districtName.toLowerCase()}`);
    }, 2000);
  };

  const districtStats = useMemo(() => {
    const allStats = DISTRICTS.map((districtName) => {
      const normalized = districtName.toLowerCase();
      const registryStats = districtRegistry?.[normalized] || {};

      let todayRaised = 0;
      let todayAppealed = 0;
      let todayResolved = 0;
      let todayPending = 0;
      let todayReAppealed = 0;
      let todayRejected = 0;

      Object.values(proofRegistry || {}).forEach((userProofs) => {
        Object.values(userProofs || {}).forEach(({ complaint }) => {
          if (!complaint || complaint.district?.toLowerCase() !== normalized)
            return;

          const { status, timestamp } = complaint;
          const isTodayComplaint = isToday(timestamp);
          const s = status?.toLowerCase();

          if (isTodayComplaint) todayRaised += 1;
          if (s === "appealed" && isTodayComplaint) todayAppealed += 1;
          if (s === "resolved" && isTodayComplaint) todayResolved += 1;
          if (s === "pending" && isTodayComplaint) todayPending += 1;
          if (s === "reappealed" && isTodayComplaint) todayReAppealed += 1;
          if (s === "rejected") {
            console.log("🔍", {
              timestamp,
              isToday: isToday(timestamp),
              status: s,
              district: complaint.district,
            });

            if (isTodayComplaint) todayRejected += 1;
          }
        });
      });

      return {
        districtName:
          districtName.charAt(0).toUpperCase() + districtName.slice(1),
        todayRaised,
        totalRaised: registryStats.raised || registryStats.totalcount || 0, // ✅ Updated line
        todayAppealed,
        totalAppealed: registryStats.appealed || 0,
        todayResolved,
        totalResolved: registryStats.resolved || 0,
        todayPending,
        totalPending: registryStats.pending || 0,
        todayReAppealed,
        totalReAppealed: registryStats.reappealed || 0,
        todayRejected,
        totalRejected: registryStats.rejected || 0,
      };
    });

    const sortedStats = allStats
      .filter((d) =>
        selectedDistrict
          ? d.districtName.toLowerCase() === selectedDistrict.toLowerCase()
          : true
      )
      .sort((a, b) => {
        if (b.todayRaised !== a.todayRaised)
          return b.todayRaised - a.todayRaised;
        if (b.totalRaised !== a.totalRaised)
          return b.totalRaised - a.totalRaised;
        if (b.totalResolved !== a.totalResolved)
          return b.totalResolved - a.totalResolved;
        if (b.totalPending !== a.totalPending)
          return b.totalPending - a.totalPending;
        return b.totalRejected - a.totalRejected;
      });

    return sortedStats;
  }, [proofRegistry, districtRegistry, selectedDistrict]);

  const columns = useMemo(
    () =>
      getDistrictComplaintTableColumns({
        labels,
        onViewClick: () => {},
        onHeaderClick: () => setIsSearchModalOpen(true),
      }),
    [labels]
  );

  const {
    currentPage,
    totalPages,
    pageItems: paginatedDistricts,
    setPage,
  } = usePagination(districtStats, 10);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-8xl flex flex-col p-8 px-5 mt-8 space-y-10 mb-5">
      <DistrictComplaintTable
        columns={columns}
        rows={paginatedDistricts}
        emptyMessage={labels.table.noData}
        onRowClick={handleRowClick}
      />

      <div className="pt-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />

      <SecurityRowModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleSecuritySuccess}
        clickedDistrict={clickedDistrict}
      />
    </div>
  );
};

export default DistrictRegistryTable;
