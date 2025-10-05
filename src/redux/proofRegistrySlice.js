import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const proofRegistrySlice = createSlice({
  name: "proofRegistry",
  initialState,
  reducers: {
    addProofRegistry: (state, action) => {
      const {
        userId,
        complaintId,
        complaint,
        proofs,
        districtRegistrySnapshot,
      } = action.payload;

      if (!state[userId]) state[userId] = {};
      state[userId][complaintId] = {
        complaint,
        proofs,
        districtRegistrySnapshot: districtRegistrySnapshot || {},
      };

      console.log("🧾 proofRegistry payload:", action.payload);
    },

    updateComplaintStatus: (state, action) => {
      const {
        userId,
        complaintId,
        newStatus,
        timestamp,
        userFeedback,
        rejectionReason,

        statusHistory,
      } = action.payload;

      const entry = state[userId]?.[complaintId];
      if (!entry) return;

      entry.complaint.status = newStatus;

      entry.complaint.statusHistory = Array.isArray(statusHistory)
        ? statusHistory
        : [{ status: newStatus, timestamp }];

      if (userFeedback !== undefined) {
        entry.complaint.userFeedback = userFeedback;
      }

      // ✅ Store rejection metadata directly in complaint
      if (rejectionReason !== undefined) {
        entry.complaint.rejectionReason = rejectionReason;
      }

      // Store as nested object for analytics or UI grouping
      entry.rejected = {
        rejectionReason,

        timestamp,
      };

      console.log("Complaint updated:", entry);

      state[userId] = { ...state[userId] };
    },

    resetProofRegistry: () => initialState,
  },
});

export const { addProofRegistry, updateComplaintStatus, resetProofRegistry } =
  proofRegistrySlice.actions;

export default proofRegistrySlice.reducer;
