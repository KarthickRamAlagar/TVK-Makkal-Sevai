import { FiDownload } from "react-icons/fi";
import getStatusStyle from "@/utils/getStatusStyle";

// for specific user table 
export const getComplaintTableColumns = ({
  labels,
  setIsStatusModalOpen,
  handleZipDownload,
  setAlertMessage,
  setShowAlert,
}) => [
  {
    key: "complaintId",
    header: labels.table.complaintId,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 max-w-[180px] truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
  },
  {
    key: "status",
    header: labels.table.status,
    thClassName: "py-5 px-6 cursor-pointer hover:text-yellow-500 transition",
    onHeaderClick: () => setIsStatusModalOpen(true),
    tdClassName: "py-5 px-6",
    cell: (row) => (
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${getStatusStyle(
          row.complaint.status
        )}`}
      >
        {row.complaint.status}
      </span>
    ),
  },
  {
    key: "department",
    header: labels.table.department,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 max-w-[160px] truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.department,
  },
  {
    key: "district",
    header: labels.table.district,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 max-w-[160px] truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.district,
  },
  {
    key: "taluk",
    header: labels.table.taluk,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.taluk,
  },
  {
    key: "wardNo",
    header: labels.table.wardNo,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.wardNo,
  },
  {
    key: "whatsapp",
    header: labels.table.whatsapp,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.whatsapp,
  },
  {
    key: "email",
    header: labels.table.email,
    thClassName: "py-5 px-6",
    tdClassName:
      "py-5 px-6 max-w-[160px] truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 font-semibold",
    cell: (row) => row.complaint.email,
  },
  {
    key: "proofs",
    header: labels.table.proofs,
    thClassName: "py-5 px-6",
    tdClassName: "py-5 px-6",
    cell: (row) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleZipDownload(row.complaintId, row.proofs);
        }}
        onMouseEnter={() => {
          setAlertMessage(`Complaint ID: ${row.complaintId}`);
          setShowAlert(true);
        }}
        onMouseLeave={() => setShowAlert(false)}
        className="relative text-gray-600 hover:text-gray-800 transition"
      >
        <FiDownload size={22} />
      </button>
    ),
  },
];
