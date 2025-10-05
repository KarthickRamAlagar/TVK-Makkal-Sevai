// src/utils/statusHistoryUtils.js
export const zipStatusHistory = (statusHistory) => {
  const { status = [], timeStamps = [] } = statusHistory || {};
  return status.map((s, i) => ({
    status: s,
    timestamp: timeStamps[i],
  }));
};
