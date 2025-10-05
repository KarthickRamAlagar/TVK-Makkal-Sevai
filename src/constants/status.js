export const COMPLAINT_STATUS = {
  APPEALED: "appealed",
  PENDING: "pending",
  RESOLVED: "resolved",
  REAPPEALED: "reappealed",
  FEEDBACK_PENDING: "FeedbackPending",
  REJECTED: "rejected", // ✅ Add this
};

export const COMPLAINT_STATUS_OPTIONS = [
  { label: "Appealed", value: COMPLAINT_STATUS.APPEALED },
  { label: "Pending", value: COMPLAINT_STATUS.PENDING },
  { label: "Resolved", value: COMPLAINT_STATUS.RESOLVED },
  { label: "Re-Appealed", value: COMPLAINT_STATUS.REAPPEALED },
  { label: "Rejected", value: COMPLAINT_STATUS.REJECTED }, // ✅ Add this
];
