

import React from "react";
import { X } from "lucide-react";

const RejectionModal = ({
  isOpen,
  onClose,
  complaintId,
  complaintStatus,
  rejectionReason = "",
  district = "",
}) => {
  if (!isOpen) return null;

  const formattedDistrict = district
    ? `${district.charAt(0).toUpperCase()}${district.slice(1)} Authority`
    : "District Authority";

  const reasonText =
    rejectionReason.trim() || "No reason provided by authority.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rejection-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-6 relative animate-fadeIn">
        <button
          className="absolute top-6 right-4 bg-red-500 text-white rounded-lg p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={onClose}
          aria-label="Close rejection modal"
        >
          <X size={28} />
        </button>

        <h2
          id="rejection-title"
          className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent"
        >
          Complaint Rejected
        </h2>

        <div className="space-y-2 text-purple-600 font-bold text-lg">
          {complaintId && (
            <div>
              Complaint ID:
              <span className="text-green-500 px-2">{complaintId}</span>
            </div>
          )}
          {complaintStatus && (
            <div>
              Status:
              <span className="text-orange-500 px-2">{complaintStatus}</span>
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-2">
          <h3 className="text-red-600 font-bold text-lg mb-2">
            Rejection Reason
          </h3>
          <p className="text-gray-800 text-md whitespace-pre-line">
            {reasonText}
          </p>
          <div className="mt-5 flex justify-end pr-4">
            <div className="text-lg font-semibold text-gray-700 text-left">
              With Regards
              <span className="text-red-500 block">{formattedDistrict}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold shadow-md bg-red-600 hover:bg-red-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
