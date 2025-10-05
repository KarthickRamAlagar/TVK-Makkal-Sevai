

// redux/districtSelectors.js

import { createSelector } from "@reduxjs/toolkit";
import { rebuildDistrictRegistryFromProofs } from "../utils/statAggregation";

export const selectMergedDistrictStats = createSelector(
  [(state) => state.proofRegistry, (state) => state.districtRegistry],
  (proofRegistry, districtRegistry) => {
    const hasDistrictRegistry = Object.keys(districtRegistry || {}).length > 0;
    return hasDistrictRegistry
      ? districtRegistry
      : rebuildDistrictRegistryFromProofs(proofRegistry);
  }
);

//  Selector for a specific district's stats
export const selectStatsForDistrict = (districtName) =>
  createSelector([selectMergedDistrictStats], (mergedStats) => {
    if (!districtName) return null;
    const normalized = districtName.trim().toLowerCase();
    return mergedStats[normalized] || null;
  });
