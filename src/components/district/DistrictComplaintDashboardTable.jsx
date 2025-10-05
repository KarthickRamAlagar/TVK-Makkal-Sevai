import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StatusUpdateModal from "./StatusUpdateModal";
import DistrictComplaintTable from "./DComplaintTable";
import PaginationControls from "../common/PaginationControls";
import Alert from "../common/Alert";
import DistrictDetailsModal from "./DistrictComplaintModal";
import { ProofsModal } from "./ProofsModal";

import usePagination from "../../hooks/usePagination";
import { getDistrictComplaintColumns } from "../../constants/getDistrictComplaintColumns.jsx";
import { getDistrictProofRows } from "@/utils/helpers";

const DistrictComplaintDashboardTable = ({ filters, handleZipDownload }) => {
  const { districtName } = useParams();
  const proofRegistry = useSelector((state) => state.proofRegistry);

  const [selectedStatusComplaint, setSelectedStatusComplaint] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedProofComplaint, setSelectedProofComplaint] = useState(null);
  const [showProofsModal, setShowProofsModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [rejectedComplaintMeta, setRejectedComplaintMeta] = useState(null);

  const [proofViewedMap, setProofViewedMap] = useState({}); //  Track viewed proofs


  const filteredRows = useMemo(() => {
    let data = getDistrictProofRows(proofRegistry, districtName);

    // 🟡 Filter by status
    const statusValues = Array.isArray(filters.status)
      ? filters.status
      : filters.status
        ? [filters.status]
        : [];
    if (statusValues.length) {
      const statusSet = new Set(statusValues.map((s) => s.toLowerCase()));
      data = data.filter((row) => statusSet.has(row.status?.toLowerCase()));
    }

    // 🟡 Filter by feedback
    const feedbackValues = Array.isArray(filters.feedback)
      ? filters.feedback
      : filters.feedback
        ? [filters.feedback]
        : [];
    if (feedbackValues.length) {
      const feedbackSet = new Set(feedbackValues.map((f) => f.toLowerCase()));
      data = data.filter((row) => {
        const feedbackObj = row.userFeedback;
        let normalized = "";
        if (typeof feedbackObj === "object") {
          normalized =
            feedbackObj.satisfied === true
              ? "satisfactory"
              : feedbackObj.satisfied === false
                ? "not satisfactory"
                : "";
        } else if (typeof feedbackObj === "string") {
          normalized = feedbackObj.toLowerCase();
        }
        return feedbackSet.has(normalized);
      });
    }

    // 🟡 Filter by taluk
    const normalizeTaluk = (taluk) =>
      taluk?.toLowerCase().replace(/\s+/g, " ").trim();

    const talukValues = Array.isArray(filters.taluk)
      ? filters.taluk
      : filters.taluk
        ? [filters.taluk]
        : [];

    if (talukValues.length) {
      const normalizedDirections = talukValues.map((t) => normalizeTaluk(t));
      data = data.filter((row) => {
        const rowTaluk = normalizeTaluk(row.taluk);
        return normalizedDirections.some(
          (dir) => rowTaluk === dir || rowTaluk.endsWith(` ${dir}`)
        );
      });
    }

    // 🟡 Filter by department
    const departmentValues = Array.isArray(filters.department)
      ? filters.department
      : filters.department
        ? [filters.department]
        : [];
    if (departmentValues.length) {
      const deptSet = new Set(
        departmentValues.map((d) => d?.value?.toLowerCase()).filter(Boolean)
      );
      data = data.filter((row) => deptSet.has(row.department?.toLowerCase()));
    }

    // 🟡 Filter by date range
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);
      data = data.filter((row) => {
        const rowDate = new Date(row.date);
        return rowDate >= from && rowDate <= to;
      });
    }

    // 🔽 FINAL STEP: Sort by date descending (newest first)
    // This is applied AFTER all filters, and is independent of status
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    return data;
  }, [proofRegistry, districtName, filters]);

  const columns = useMemo(
    () =>
      getDistrictComplaintColumns({
        handleZipDownload,
        setAlertMessage,
        setShowAlert,
        districtName,
        setSelectedStatusComplaint: (complaint) => {
          const id = complaint?.complaintId;
          const status = complaint?.status?.toLowerCase();

          if (status !== "resolved" && !proofViewedMap[id]) {
            setAlertMessage("Please view the proof before updating status.");
            setShowAlert(true);
            return;
          }

          setSelectedStatusComplaint(complaint);
        },

        openProofsModal: (complaint) => {
          setSelectedProofComplaint(complaint);
          setShowProofsModal(true);

          // Mark proof as viewed
          setProofViewedMap((prev) => ({
            ...prev,
            [complaint.complaintId]: true,
          }));
        },
      }),
    [handleZipDownload, districtName, proofViewedMap]
  );

  const {
    currentPage,
    totalPages,
    pageItems: paginatedRows,
    setPage,
  } = usePagination(filteredRows, 7);

  const labels = {
    modal: {
      title: "Complaint Details",
      fields: {
        complaintId: "Complaint ID",
        date: "Date",
        taluk: "Taluk",
        wardNo: "Ward No",
        department: "Department",
        userName: "User Name",
        userId: "User ID",
        email: "Email",
        whatsapp: "WhatsApp",
        status: "Status",
        userFeedback: "User Feedback",
      },
    },
  };

  const getEmptyMessage = () => {
    const activeFilters = [];

    if (filters.status) {
      const status = Array.isArray(filters.status)
        ? filters.status.join(", ")
        : filters.status;
      activeFilters.push(`Status: ${status}`);
    }

    if (filters.feedback) {
      const feedback = Array.isArray(filters.feedback)
        ? filters.feedback.join(", ")
        : filters.feedback;
      activeFilters.push(`Feedback: ${feedback}`);
    }

    if (filters.taluk) {
      const taluk = Array.isArray(filters.taluk)
        ? filters.taluk.join(", ")
        : filters.taluk;
      activeFilters.push(`Taluk: ${taluk}`);
    }

    if (filters.department) {
      const departments = Array.isArray(filters.department)
        ? filters.department.map((d) => d?.label || d?.value).join(", ")
        : filters.department?.label || filters.department?.value;
      activeFilters.push(`Department: ${departments}`);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      activeFilters.push(
        `Date Range: ${filters.dateRange.from} to ${filters.dateRange.to}`
      );
    }

    if (activeFilters.length === 0) {
      return `No complaints found for district "${districtName}"`;
    }

    return `No complaints found for district "${districtName}" with filters → ${activeFilters.join(" | ")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-8xl flex flex-col p-8 px-5 mt-8 space-y-10 mb-5">
      <DistrictComplaintTable
        columns={columns}
        rows={paginatedRows}
        emptyMessage={getEmptyMessage()}
        onRowClick={(row) => setSelectedComplaint({ complaint: row })}
      />
      {totalPages > 1 && (
        <div className="pt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <DistrictDetailsModal
        open={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        data={selectedComplaint}
        labels={labels}
      />
      <StatusUpdateModal
        open={!!selectedStatusComplaint}
        complaint={selectedStatusComplaint}
        onClose={() => setSelectedStatusComplaint(null)}
        onRejectedStatusSet={(meta) => {
          setRejectedComplaintMeta(meta);
        }}
      />

      {showProofsModal && selectedProofComplaint && (
        <ProofsModal
          isOpen={showProofsModal}
          onClose={() => setShowProofsModal(false)}
          onOpenNextModal={() => {
            const id = selectedProofComplaint?.complaintId;
            const status = selectedProofComplaint?.status?.toLowerCase();

            if (status !== "resolved" && !proofViewedMap[id]) {
              setAlertMessage("Please view the proof before updating status.");
              setShowAlert(true);
              return;
            }

            setShowProofsModal(false);
            setSelectedStatusComplaint(selectedProofComplaint);
          }}
          complaint={selectedProofComplaint}
        />
      )}
    </div>
  );
};

export default DistrictComplaintDashboardTable;
