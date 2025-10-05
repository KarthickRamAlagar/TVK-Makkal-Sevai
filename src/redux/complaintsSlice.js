import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    addComplaint: (state, action) => {
      const {
        complaintId,
        userId,
        status = "appealed",
        ...data
      } = action.payload;
      if (!state[userId]) {
        state[userId] = {};
      }
      state[userId][complaintId] = {
        ...data,
        status,
      };
    },
    updateComplaintStatus: (state, action) => {
      const { userId, complaintId, newStatus } = action.payload;
      const complaintEntry = state[userId]?.[complaintId];
      if (complaintEntry) {
        complaintEntry.status = newStatus;
      }
    },

    resetComplaints: () => initialState,
  },
});

export const { addComplaint, resetComplaints, updateComplaintStatus } =
  complaintsSlice.actions;

export default complaintsSlice.reducer;
