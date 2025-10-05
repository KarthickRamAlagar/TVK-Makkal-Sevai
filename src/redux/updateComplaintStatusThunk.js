import { updateComplaintStatus } from "./proofRegistrySlice";
import { incrementDistrictStat } from "./districtRegistrySlice";

export const updateComplaintStatusThunk =
  ({
    userId,
    complaintId,
    newStatus,
    timestamp,
    userFeedback = {},
    rejection = {},
  }) =>
  (dispatch, getState) => {
    const state = getState();
    const entry = state.proofRegistry[userId]?.[complaintId]?.complaint;
    if (!entry) return;

    const prevStatus = entry.status?.trim().toLowerCase();
    const district = entry.district?.trim().toLowerCase();
    const nextStatus = newStatus?.trim().toLowerCase();

    const today = new Date().toISOString().slice(0, 10);
    const updatedHistory = Array.isArray(entry.statusHistory)
      ? [...entry.statusHistory, { status: nextStatus, date: today }]
      : [{ status: nextStatus, date: today }];

    const payload = {
      userId,
      complaintId,
      newStatus,
      timestamp,
      userFeedback,
      prevStatus,
      statusHistory: updatedHistory,
    };

    // ✅ Inject rejection metadata only if present
    if (rejection?.rejectionReason || rejection?.authorityId) {
      payload.rejectionReason = rejection.rejectionReason;
      payload.authorityId = rejection.authorityId;
    }

    dispatch(updateComplaintStatus(payload));

    console.log("🧾 Updated Complaint:", {
      complaintId,
      newStatus,
      userFeedback,
      rejection,
    });

    // District stat mutation
    if (district) {
      if (nextStatus)
        dispatch(incrementDistrictStat({ district, status: nextStatus }));
      if (prevStatus)
        dispatch(
          incrementDistrictStat({
            district,
            status: prevStatus,
            decrement: true,
          })
        );
    }
  };
