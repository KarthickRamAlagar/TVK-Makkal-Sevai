

import { createSlice } from "@reduxjs/toolkit";

const normalizeKey = (str) => (str || "").toString().trim().toLowerCase();

// ✅ Whitelisted stat keys only
const allowedKeys = new Set([
  "totalcount",
  "raised",
  "todayRaised",
  "appealed",
  "todayAppealed",
  "pending",
  "todayPending",
  "resolved",
  "todayResolved",
  "reappealed",
  "todayReappealed",
  "rejected",
  "todayRejected",
]);

// ✅ Default stats derived from whitelist
const defaultStats = {};
allowedKeys.forEach((key) => {
  defaultStats[key] = 0;
});

const districtRegistrySlice = createSlice({
  name: "districtRegistry",
  initialState: {},
  reducers: {
    incrementDistrictStat: (state, action) => {
      const { district, status, decrement = false } = action.payload;
      const d = normalizeKey(district);
      const s = status;

      if (!d || !s || !allowedKeys.has(s)) return;

      if (!state[d]) state[d] = { ...defaultStats };

      if (s === "totalcount") {
        const delta = decrement ? -1 : 1;
        state[d].totalcount = Math.max(0, (state[d].totalcount || 0) + delta);
        state[d].raised = state[d].totalcount; // Sync raised
        return;
      }

      if (state[d][s] === undefined) state[d][s] = 0;

      const delta = decrement ? -1 : 1;
      state[d][s] = Math.max(0, (state[d][s] || 0) + delta);
    },

    mergeDistrictRegistry: (state, action) => {
      const incoming = action.payload || {};
      Object.entries(incoming).forEach(([district, stats]) => {
        const d = normalizeKey(district);
        if (!state[d]) state[d] = { ...defaultStats };

        Object.entries(stats || {}).forEach(([status, count]) => {
          if (!allowedKeys.has(status)) return;
          if (state[d][status] === undefined) state[d][status] = 0;
          state[d][status] += Number(count || 0);
        });

        state[d].raised = state[d].totalcount; // Sync raised
      });
    },

    resetDistrictRegistry: () => ({}),

    setDistrictRegistry: (state, action) => {
      const incoming = action.payload || {};
      const validated = {};

      Object.entries(incoming).forEach(([district, stats]) => {
        const d = normalizeKey(district);
        validated[d] = { ...defaultStats };

        Object.entries(stats || {}).forEach(([status, count]) => {
          if (!allowedKeys.has(status)) return;
          validated[d][status] = Number(count || 0);
        });

        validated[d].raised = validated[d].totalcount; // Sync raised
      });

      return validated;
    },
  },
});

export const {
  incrementDistrictStat,
  mergeDistrictRegistry,
  resetDistrictRegistry,
  setDistrictRegistry,
} = districtRegistrySlice.actions;

export default districtRegistrySlice.reducer;
