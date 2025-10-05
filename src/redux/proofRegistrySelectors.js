// Stat Aggregation
export const selectGlobalStatCounts = (state) => {
  const aggregate = (map) =>
    Object.values(map || {}).reduce((sum, val) => sum + val, 0);

  return {
    totalIssuesRaised: aggregate(state.proofRegistry.totalIssuesRaised),
    pending: aggregate(state.proofRegistry.pending),
    resolved: aggregate(state.proofRegistry.resolved),
    reAppealed: aggregate(state.proofRegistry.reAppealed),
  };
};

export const selectUserStatCounts = (userId) => (state) => ({
  totalIssuesRaised: state.proofRegistry.totalIssuesRaised?.[userId] || 0,
  pending: state.proofRegistry.pending?.[userId] || 0,
  resolved: state.proofRegistry.resolved?.[userId] || 0,
  reAppealed: state.proofRegistry.reAppealed?.[userId] || 0,
});

// Complaint Sorting
export const selectSortedComplaintsByUser = (userId) => (state) => {
  const userRegistry = state.proofRegistry[userId];
  if (!userRegistry) return [];

  return Object.entries(userRegistry)
    .map(([complaintId, data]) => ({ complaintId, ...data }))
    .sort(
      (a, b) =>
        new Date(b.complaint.timestamp) - new Date(a.complaint.timestamp)
    );
};

export const selectRejectionReason = (userId, complaintId) =>
  createSelector(
    (state) =>
      state.proofRegistry?.[userId]?.[complaintId]?.complaint?.rejectionReason,
    (reason) => reason || ""
  );
