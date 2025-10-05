import { createSelector } from "@reduxjs/toolkit";
import { zipStatusHistory } from "../utils/statusHistoryUtils";
import dayjs from "dayjs";
//  Default status keys
const defaultStats = {
  totalcount: 0,
  raised: 0,
  todayRaised: 0,
  appealed: 0,
  todayAppealed: 0,
  pending: 0,
  todayPending: 0,
  resolved: 0,
  todayResolved: 0,
  reappealed: 0,
  todayReappealed: 0,
  rejected: 0,
  todayRejected: 0,
};

const capitalize = (str) =>
  typeof str === "string" && str.length
    ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    : "";

//  Selector: All complaints raised by a user (unsorted)
export const selectAllComplaintsByUser = (userId) =>
  createSelector(
    (state) => state.proofRegistry[userId] || {},
    (userComplaints) =>
      Object.entries(userComplaints).map(([complaintId, data]) => ({
        complaintId,
        ...data,
      }))
  );

//  Selector: Sorted complaints by timestamp
export const selectSortedComplaintsByUser = (userId) =>
  createSelector(selectAllComplaintsByUser(userId), (complaints) =>
    [...complaints].sort(
      (a, b) =>
        new Date(b.complaint.timestamp) - new Date(a.complaint.timestamp)
    )
  );

//  Selector: Status counts for a user
export const selectComplaintStatusCountsByUser = (userId) =>
  createSelector(selectAllComplaintsByUser(userId), (complaints) => {
    const counts = { ...defaultStats };
    complaints.forEach(({ complaint }) => {
      const status = complaint?.status?.trim().toLowerCase();
      if (status && counts.hasOwnProperty(status)) {
        counts[status] += 1;
      }
      counts.totalcount += 1;
      counts.raised += 1;
    });
    return counts;
  });

//  Selector: Global stat aggregation
export const selectGlobalStatCounts = createSelector(
  (state) => state.proofRegistry,
  (proofRegistry) => {
    const today = new Date().toISOString().slice(0, 10);
    const counts = { ...defaultStats };

    Object.values(proofRegistry || {}).forEach((userComplaints) => {
      Object.values(userComplaints || {}).forEach(({ complaint }) => {
        counts.totalcount += 1;
        counts.raised += 1;

        const history = complaint.statusHistory || [];
        const latest = history[history.length - 1];
        const todayEntry = history.find(
          (h) => h.timestamp?.slice(0, 10) === today
        );

        const latestStatus = latest?.status?.trim().toLowerCase();
        const todayStatus = todayEntry?.status?.trim().toLowerCase();

        if (latestStatus && counts.hasOwnProperty(latestStatus)) {
          counts[latestStatus] += 1;
        }

        const todayKey = `today${capitalize(todayStatus)}`;
        if (todayStatus && counts.hasOwnProperty(todayKey)) {
          counts[todayKey] += 1;
        }
      });
    });

    return counts;
  }
);

//  Selector: Zipped status history
export const selectZippedStatusHistory = (userId, complaintId) =>
  createSelector(
    (state) =>
      state.proofRegistry?.[userId]?.[complaintId]?.complaint?.statusHistory,
    (statusHistory) => zipStatusHistory(statusHistory)
  );

// redux/selectors/userSelectors.js

export const selectAuthorityByDistrict = (districtName) =>
  createSelector(
    (state) => state.user.userRegistry,
    (registry) => {
      if (!districtName || !registry) return null;
      const normalized = districtName.trim().toLowerCase();

      return Object.values(registry).find(
        (user) =>
          user.role === "district_Authority" &&
          user.district?.trim().toLowerCase() === normalized
      );
    }
  );

import { selectMergedDistrictStats } from "./districtSelectors";



export const selectFilteredComplaints = (
  district,
  range = "today",
  status = "All"
) =>
  createSelector(
    (state) => state.proofRegistry,
    (proofRegistry) => {
      const normalized = district?.trim().toLowerCase();
      if (!normalized || !proofRegistry) return [];

      const complaints = [];

      Object.entries(proofRegistry).forEach(([userId, userComplaints]) => {
        Object.entries(userComplaints).forEach(([complaintId, entry]) => {
          const { complaint } = entry;
          const complaintDistrict = complaint?.district?.trim().toLowerCase();
          const complaintStatus = complaint?.status?.trim().toLowerCase();
          const filterStatus = status?.trim().toLowerCase();

          const complaintDate = complaint?.timestamp?.slice(0, 10);
          const today = new Date().toISOString().slice(0, 10);

          const isInRange = range === "today" ? complaintDate === today : true;
          const isInDistrict = complaintDistrict === normalized;
          const isInStatus =
            filterStatus === "all" ? true : complaintStatus === filterStatus;

          if (isInDistrict && isInRange && isInStatus) {
            complaints.push({ ...complaint, complaintId });
          }
        });
      });

      return complaints;
    }
  );
