import React, { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import Alert from "../common/Alert";
import { useDispatch, useSelector } from "react-redux";
import { updateComplaintStatusThunk } from "../../redux/updateComplaintStatusThunk";
import { COMPLAINT_STATUS } from "../../constants/status";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const StatusUpdateModal = ({
  open,
  onClose,
  complaint,
  onRejectedStatusSet,
}) => {
  if (!open || !complaint) return null;

  const dispatch = useDispatch();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const currentStatus = complaint.status;
  const complaintId = complaint.complaintId;
  const userId = complaint.userId;

  const [width, height] = useWindowSize();
  const showConfetti = currentStatus === COMPLAINT_STATUS.RESOLVED;

  const allowedNextStatuses = useMemo(() => {
    switch (currentStatus) {
      case COMPLAINT_STATUS.APPEALED:
        return [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.REJECTED];
      case COMPLAINT_STATUS.REAPPEALED:
        return [
          COMPLAINT_STATUS.PENDING,
          COMPLAINT_STATUS.RESOLVED,
          COMPLAINT_STATUS.REJECTED,
        ];
      case COMPLAINT_STATUS.PENDING:
        return [COMPLAINT_STATUS.RESOLVED];
      default:
        return [];
    }
  }, [currentStatus]);

  const allStatusOptions = [
    COMPLAINT_STATUS.APPEALED,
    COMPLAINT_STATUS.PENDING,
    COMPLAINT_STATUS.RESOLVED,
    COMPLAINT_STATUS.REJECTED,
  ];

  const handleConfirm = () => {
    if (!allowedNextStatuses.includes(selectedStatus)) {
      setAlertMessage(
        ` Invalid transition: "${currentStatus}" → "${selectedStatus}".`
      );
      setShowAlert(true);
      return;
    }

    if (
      selectedStatus === COMPLAINT_STATUS.REJECTED &&
      !rejectionReason.trim()
    ) {
      setAlertMessage("⚠️ Please provide a reason for rejection.");
      setShowAlert(true);
      return;
    }

    const timestamp = new Date().toISOString();
    let finalStatus = selectedStatus;

    if (selectedStatus === COMPLAINT_STATUS.RESOLVED) {
      finalStatus = COMPLAINT_STATUS.FEEDBACK_PENDING;
    }

    dispatch(
      updateComplaintStatusThunk({
        userId,
        complaintId,
        newStatus: finalStatus,
        timestamp,
        userFeedback: "",
        rejection:
          selectedStatus === COMPLAINT_STATUS.REJECTED
            ? {
                rejectionReason,
              }
            : {},
      })
    );

    if (
      selectedStatus === COMPLAINT_STATUS.REJECTED &&
      typeof onRejectedStatusSet === "function"
    ) {
      onRejectedStatusSet({
        complaintId,
        complaintStatus: selectedStatus,
        rejectionReason,
      });
    }

    setAlertMessage(
      ` Complaint ID: ${complaintId} — ${currentStatus} → ${selectedStatus}`
    );
    setShowAlert(true);
    onClose();
  };

  const handleReset = () => {
    setAlertMessage(
      `🔄 Complaint ID: ${complaintId} — Reset to ${currentStatus}`
    );
    setSelectedStatus("");
    setRejectionReason("");
    setShowAlert(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-[95%] max-w-[600px] space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-pink-500 text-2xl md:text-3xl">
            Status Toggling
          </span>
          <button
            onClick={onClose}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Complaint ID */}
        <div className="space-y-2 text-xl md:text-2xl">
          <p className="text-blue-600 font-semibold">
            <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent font-bold">
              Complaint ID:
            </span>{" "}
            <span className="text-purple-600 text-lg md:text-xl font-bold break-words">
              {complaintId}
            </span>
          </p>
        </div>

        {/* Confetti for resolved */}
        {currentStatus === COMPLAINT_STATUS.RESOLVED && showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={true}
            numberOfPieces={350}
          />
        )}

        {/* Status Display */}
        {currentStatus === COMPLAINT_STATUS.RESOLVED ? (
          <>
            <div className="text-center text-lg font-bold text-yellow-500 mt-2">
              Current Status:{" "}
              <span className="capitalize">{currentStatus}</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-green-50 border border-green-300 rounded-xl p-4 text-green-700 text-xl font-semibold">
              <img
                src="/assets/flag.jpg"
                alt="Resolved Flag"
                className="w-8 h-8"
              />
              Hurray! Issue is resolved
            </div>
          </>
        ) : (
          <>
            {/* Status Comparison */}
            <div className="flex flex-row items-center justify-between gap-4 text-blue-600 font-semibold text-lg md:text-xl">
              <div className="flex-1 text-center md:text-left">
                Current Status:{" "}
                <span className="text-orange-600 font-bold capitalize">
                  {currentStatus}
                </span>
              </div>

              <div className="text-xl font-bold text-gray-500">
                <span className="sm:inline">→</span>
              </div>

              <div className="flex-1 text-center md:text-right text-medium md:text-xl">
                New Status:{" "}
                <span className="text-green-600 font-bold">
                  {selectedStatus || "—"}
                </span>
              </div>
            </div>

            {/* Status Options */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              {allStatusOptions.map((status) => {
                const isAllowed =
                  status === COMPLAINT_STATUS.REJECTED
                    ? currentStatus === COMPLAINT_STATUS.APPEALED ||
                      currentStatus === COMPLAINT_STATUS.REAPPEALED
                    : allowedNextStatuses.includes(status);

                const tooltip = !isAllowed
                  ? `Blocked: Cannot change "${currentStatus}" → "${status}"`
                  : "";

                return (
                  <label
                    key={`status-option-${status}`}
                    className={`flex items-center space-x-2 cursor-pointer ${
                      !isAllowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={tooltip}
                  >
                    <input
                      type="radio"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => isAllowed && setSelectedStatus(status)}
                      disabled={!isAllowed}
                      className="accent-green-600"
                    />
                    <span className="text-orange-500 font-bold text-lg md:text-lg">
                      {status}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Rejection Reason */}
            {selectedStatus === COMPLAINT_STATUS.REJECTED && (
              <textarea
                placeholder="Please provide reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 border border-red-300 rounded-xl text-lg text-gray-700 mt-4"
                rows={4}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-2xl w-full text-xl"
              >
                Confirm
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white py-2 px-4 font-bold rounded-2xl w-full text-xl"
              >
                Reset
              </button>
            </div>
          </>
        )}

        {/* Alert Feedback */}
        <Alert
          message={alertMessage}
          show={showAlert}
          onClose={() => setShowAlert(false)}
        />
      </div>
    </div>
  );
};

export default StatusUpdateModal;
