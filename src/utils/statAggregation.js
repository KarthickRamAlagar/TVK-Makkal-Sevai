
const normalizeKey = (str) => (str || "").toString().trim().toLowerCase();

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

const defaultStats = {};
allowedKeys.forEach((key) => {
  defaultStats[key] = 0;
});

const capitalize = (str) =>
  typeof str === "string" && str.length
    ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    : "";

export const rebuildDistrictRegistryFromProofs = (proofRegistry) => {
  const registry = {};
  const today = new Date().toISOString().slice(0, 10);

  Object.values(proofRegistry || {}).forEach((userComplaints) => {
    Object.values(userComplaints || {}).forEach((entry) => {
      const complaint = entry?.complaint;
      const district = normalizeKey(complaint?.district);
      const history = complaint?.statusHistory || [];

      if (!district || history.length === 0) return;

      if (!registry[district]) registry[district] = { ...defaultStats };

      registry[district].totalcount += 1;
      registry[district].raised += 1;
      registry[district].todayRaised += 1;

      const latestStatus = normalizeKey(history[history.length - 1]?.status);
      const todayStatusEntry = history.find((h) => h.date === today);
      const todayStatus = normalizeKey(todayStatusEntry?.status);

      // ✅ Handle latest status
      if (
        latestStatus === "resolved" &&
        complaint?.userFeedback?.satisfied === true
      ) {
        registry[district].resolved += 1;
      } else {
        const key = latestStatus;
        if (allowedKeys.has(key)) {
          registry[district][key] += 1;
        }
      }

      // ✅ Handle today's status
      if (
        todayStatus === "resolved" &&
        complaint?.userFeedback?.satisfied === true
      ) {
        registry[district].todayResolved += 1;
      } else {
        const todayKey = `today${capitalize(todayStatus)}`;
        if (allowedKeys.has(todayKey)) {
          registry[district][todayKey] += 1;
        }
      }
    });
  });

  return registry;
};
