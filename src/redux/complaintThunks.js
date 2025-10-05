import { updateComplaintStatus } from "../proofRegistrySlice";
import { incrementDistrictStat } from "../districtRegistrySlice";

export const updateComplaintStatusWithRegistrySync =
  ({ userId, complaintId, newStatus, timestamp, userFeedback }) =>
  (dispatch, getState) => {
    const state = getState();
    const entry = state.proofRegistry?.[userId]?.[complaintId];
    if (!entry) return;

    const previousStatus = entry.complaint.status;
    const district = entry.complaint.district;

    //  Update complaint status
    dispatch(
      updateComplaintStatus({
        userId,
        complaintId,
        newStatus,
        timestamp,
        userFeedback,
      })
    );

    // Sync districtRegistry
    const d = district?.trim().toLowerCase();
    const prev = previousStatus?.trim().toLowerCase();
    const next = newStatus?.trim().toLowerCase();

    if (d) {
      if (prev && prev !== next) {
        dispatch(
          incrementDistrictStat({ district: d, status: prev, decrement: true })
        );
      }

      if (next) {
        dispatch(incrementDistrictStat({ district: d, status: next }));
      }
    }
  };
