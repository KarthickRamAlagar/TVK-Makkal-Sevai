import { FiArrowUpRight } from "react-icons/fi";

export const getDistrictComplaintTableColumns = ({
  labels = {},
  onViewClick,
  onHeaderClick,
}) => {
  const fallback = {
    districtName: "District",
    todayRaised: "Today Raised",
    totalRaised: "Total Raised",
    todayAppealed: "Today Appealed",
    totalAppealed: "Total Appealed",
    todayResolved: "Today Resolved",
    totalResolved: "Total Resolved",
    todayPending: "Today Pending",
    totalPending: "Total Pending",
    todayReAppealed: "Today Re-Appealed",
    totalReAppealed: "Total Re-Appealed",
    todayRejected: "Today Rejected",
    totalRejected: "Total Rejected",
    view: "View",
  };

  const headers = labels.table || {};

  return [
    {
      key: "districtName",
      header: headers.districtName || fallback.districtName,
      thClassName:
        "py-5 px-6 text-start cursor-pointer hover:text-yellow-500 transition",
      tdClassName:
        "py-5 px-6 text-start max-w-[180px] truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
      onHeaderClick,
      cell: (row) =>
        row.districtName
          ? row.districtName.charAt(0).toUpperCase() + row.districtName.slice(1)
          : "—",
    },
    {
      key: "todayRaised",
      header: fallback.todayRaised,
      tdClassName: "py-5 px-6 text-center font-bold text-blue-600",
    },
    {
      key: "totalRaised",
      header: fallback.totalRaised,
      tdClassName: "py-5 px-6 text-center font-bold text-blue-700",
    },
    {
      key: "todayAppealed",
      header: fallback.todayAppealed,
      tdClassName: "py-5 px-6 text-center font-bold text-pink-500",
    },
    {
      key: "totalAppealed",
      header: fallback.totalAppealed,
      tdClassName: "py-5 px-6 text-center font-bold text-pink-600",
    },
    {
      key: "todayResolved",
      header: fallback.todayResolved,
      tdClassName: "py-5 px-6 text-center font-bold text-green-600",
    },
    {
      key: "totalResolved",
      header: fallback.totalResolved,
      tdClassName: "py-5 px-6 text-center font-bold text-green-700",
    },
    {
      key: "todayPending",
      header: fallback.todayPending,
      tdClassName: "py-5 px-6 text-center font-bold text-orange-500",
    },
    {
      key: "totalPending",
      header: fallback.totalPending,
      tdClassName: "py-5 px-6 text-center font-bold text-orange-600",
    },
    {
      key: "todayReAppealed",
      header: fallback.todayReAppealed,
      tdClassName: "py-5 px-6 text-center font-bold text-purple-500",
    },
    {
      key: "totalReAppealed",
      header: fallback.totalReAppealed,
      tdClassName: "py-5 px-6 text-center font-bold text-purple-700",
    },
    {
      key: "todayRejected",
      header: fallback.todayRejected,
      tdClassName: "py-5 px-6 text-center font-bold text-red-500",
    },
    {
      key: "totalRejected",
      header: fallback.totalRejected,
      tdClassName: "py-5 px-6 text-center font-bold text-red-600",
    },
    {
      key: "view",
      header: headers.view || fallback.view,
      thClassName: "py-5 px-6 text-center",
      tdClassName: "py-5 px-6 text-center",
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewClick(row.districtName);
          }}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          <FiArrowUpRight size={22} />
        </button>
      ),
    },
  ];
};
