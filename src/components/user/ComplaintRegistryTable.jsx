// ComplaintRegistryTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import JSZip from "jszip";
import { useDispatch, useSelector } from "react-redux";

import Alert from "../common/Alert";
import StatusModal from "../common/StatusModal";
import ComplaintTable from "./ComplaintTable";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import PaginationControls from "../common/PaginationControls";
import FeedbackModal from "../district/FeedbackModal";
import RejectionModal from "../district/RejectionModal";
import usePagination from "../../hooks/usePagination";

import { userNotificationsTranslations } from "../../constants/i18nConstants/userNotificationsTranslations";
import { useTranslation } from "react-i18next";
import { getComplaintTableColumns } from "@/constants/complaintTableColumns";
import { updateComplaintStatusThunk } from "../../redux/updateComplaintStatusThunk";
import { COMPLAINT_STATUS } from "../../constants/status";
import { selectSortedComplaintsByUser } from "../../redux/proofRegistrySelectors";

const ComplaintRegistryTable = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);

  const rawComplaints = useSelector(selectSortedComplaintsByUser(userId));
  const complaints = useMemo(
    () => rawComplaints,
    [userId, rawComplaints.length]
  );

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Appealed");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedComplaintForFeedback, setSelectedComplaintForFeedback] =
    useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [feedbackReason, setFeedbackReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const labels =
    userNotificationsTranslations[lang]?.labels ||
    userNotificationsTranslations.en.labels;

  const handleZipDownload = async (complaintId, proofs) => {
    if (
      !proofs ||
      !Array.isArray(proofs.images) ||
      proofs.images.length === 0 ||
      !proofs.complaintLetter?.preview
    ) {
      setAlertMessage("Proof files are missing or invalid.");
      setShowAlert(true);
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(`proof_${complaintId}`);

    for (let i = 0; i < proofs.images.length; i++) {
      const img = proofs.images[i];
      try {
        const blob = img.file
          ? img.file
          : await fetch(img.preview).then((res) => res.blob());
        folder.file(`image_${i + 1}_${img.name}`, blob);
      } catch (err) {
        console.warn(`❌ Failed to add image ${img.name}:`, err);
      }
    }

    try {
      const blob = proofs.complaintLetter.file
        ? proofs.complaintLetter.file
        : await fetch(proofs.complaintLetter.preview).then((res) => res.blob());
      folder.file(`complaint_letter_${proofs.complaintLetter.name}`, blob);
    } catch (err) {
      console.warn("❌ Failed to add complaint letter:", err);
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `proofs_${complaintId}.zip`;
      link.click();
    } catch (err) {
      console.error("❌ ZIP generation failed:", err);
      setAlertMessage("Failed to generate ZIP file.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const feedbackPendingComplaint = complaints.find(
      ({ complaint }) =>
        complaint.status === COMPLAINT_STATUS.FEEDBACK_PENDING &&
        !complaint.userFeedback?.satisfied &&
        !complaint.userFeedback?.reason
    );

    if (feedbackPendingComplaint) {
      setSelectedComplaintForFeedback(feedbackPendingComplaint);
      setShowFeedbackModal(true);
    }
  }, [complaints]);

  useEffect(() => {
    if (
      !showFeedbackModal &&
      selectedFeedback &&
      selectedComplaintForFeedback
    ) {
      const satisfied = selectedFeedback === "Satisfactory";
      const timestamp = new Date().toISOString();

      const finalStatus = satisfied
        ? COMPLAINT_STATUS.RESOLVED
        : COMPLAINT_STATUS.REAPPEALED;

      const complaint = selectedComplaintForFeedback?.complaint;
      const rejectionReason = complaint?.rejectionReason;

      dispatch(
        updateComplaintStatusThunk({
          userId: complaint.userId,
          complaintId: complaint.complaintId,
          newStatus: finalStatus,
          timestamp,
          userFeedback: {
            satisfied,
            reason: feedbackReason,
            timestamp,
          },
          rejection: {
            rejectionReason,
          },
        })
      );

      setSelectedComplaintForFeedback(null);
      setSelectedFeedback("");
      setFeedbackReason("");
    }
  }, [showFeedbackModal]);

  const filteredComplaints = useMemo(() => complaints || [], [complaints]);

  const {
    currentPage,
    totalPages,
    pageItems: paginatedComplaints,
    setPage,
  } = usePagination(filteredComplaints, 7);

  useEffect(() => {
    setPage(1);
  }, [complaints.length]);

  const columns = useMemo(
    () =>
      getComplaintTableColumns({
        labels,
        setIsStatusModalOpen,
        handleZipDownload,
        setAlertMessage,
        setShowAlert,
      }),
    [labels]
  );

  const rejectedComplaint = complaints.find(
    ({ complaint }) =>
      complaint.status === COMPLAINT_STATUS.REJECTED &&
      !complaint.userFeedback?.satisfied &&
      !complaint.userFeedback?.reason
  );

  useEffect(() => {
    if (rejectedComplaint) {
      const dismissedKey = `rejectionDismissed_${rejectedComplaint.complaint.complaintId}`;
      const alreadyDismissed = sessionStorage.getItem(dismissedKey);

      if (!alreadyDismissed) {
        setShowRejectionModal(true);
      }
    }
  }, [rejectedComplaint]);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-8xl flex flex-col p-8 px-5 mt-8 space-y-10 mb-5">
      <ComplaintTable
        columns={columns}
        rows={paginatedComplaints}
        emptyMessage={labels.table.noData}
        onDownloadZip={handleZipDownload}
        onRowClick={(row) => {
          setSelectedComplaint({
            complaintId: row.complaintId,
            formSnapshot: row.formSnapshot,
            complaint: row.complaint,
          });
          setIsOpen(true);
        }}
      />
      <div className="pt-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
      <ComplaintDetailsModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedComplaint(null);
        }}
        data={selectedComplaint}
        labels={labels}
        rejectionReason={selectedComplaint?.complaint?.rejectionReason}
        district={selectedComplaint?.complaint?.district}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        complaintId={selectedComplaintForFeedback?.complaint?.complaintId}
        selectedFeedback={selectedFeedback}
        setSelectedFeedback={setSelectedFeedback}
        feedbackReason={feedbackReason}
        setFeedbackReason={setFeedbackReason}
        onReset={() => {
          setSelectedFeedback("");
          setFeedbackReason("");
        }}
      />
      {showRejectionModal && rejectedComplaint && (
        <RejectionModal
          isOpen={true}
          onClose={() => {
            const dismissedKey = `rejectionDismissed_${rejectedComplaint.complaint.complaintId}`;
            sessionStorage.setItem(dismissedKey, "true");
            setShowRejectionModal(false);
          }}
          complaintId={rejectedComplaint.complaint?.complaintId}
          complaintStatus={rejectedComplaint.complaint?.status}
          rejectionReason={rejectedComplaint.complaint?.rejectionReason}
          district={rejectedComplaint.complaint?.district || ""}
        />
      )}
    </div>
  );
};

export default ComplaintRegistryTable;
