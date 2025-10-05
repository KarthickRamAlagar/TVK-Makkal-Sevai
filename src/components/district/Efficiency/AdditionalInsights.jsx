import React from "react";
import InsightCard from "./InsightCard";

const AdditionalInsights = ({ allComplaints = [], selectedStatus = "All" }) => {
  // ✅ Always use full complaint list for counts
  const resolved = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  const reAppealed = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "reappealed"
  ).length;

  const rejected = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  const pending = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const totalHandled = resolved + reAppealed + rejected + pending;
  const efficiency =
    totalHandled > 0 ? Math.round((resolved / totalHandled) * 100) : 0;

  const countByStatus = (status) =>
    allComplaints.filter(
      (c) => c.status?.toLowerCase() === status.toLowerCase()
    ).length;

  const cards = [
    {
      label: "Efficiency",
      value: selectedStatus === "Rejected" ? "🫡" : `${efficiency}%`,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      label: "Resolved",
      value: countByStatus("Resolved"),
      gradient: "from-green-500 to-emerald-400",
    },
    {
      label: "Pending",
      value: countByStatus("Pending"),
      gradient: "from-yellow-400 to-orange-400",
    },
    {
      label: "ReAppealed",
      value: countByStatus("ReAppealed"),
      gradient: "from-violet-500 to-purple-400",
    },
    {
      label: "Rejected",
      value: countByStatus("Rejected"),
      gradient: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-8 w-full">
      <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
        Additional Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <InsightCard
            key={card.label}
            label={card.label}
            value={card.value}
            gradient={card.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default AdditionalInsights;
