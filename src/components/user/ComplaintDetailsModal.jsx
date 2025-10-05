import React from "react";
import {
  Smartphone,
  Globe,
  MapPin,
  MapPinned,
  Mail,
  User,
  FileText,
  BadgeCheck,
  Hash,
} from "lucide-react";

const ComplaintDetailsModal = ({
  open,
  onClose,
  data,
  labels,
  rejectionReason = "",
  district = "",
}) => {
  if (!open || !data) return null;

  const fields = labels?.modal?.fields || {};
  const complaint = data.complaint;

  const fieldMap = [
    { key: "complaintId", icon: <FileText className="inline-block mr-2" /> },
    { key: "status", icon: <User className="inline-block mr-2" /> },
    { key: "department", icon: <BadgeCheck className="inline-block mr-2" /> },
    { key: "district", icon: <Globe className="inline-block mr-2" /> },
    { key: "taluk", icon: <MapPin className="inline-block mr-2" /> },
    { key: "wardNo", icon: <MapPinned className="inline-block mr-2" /> },
    { key: "whatsapp", icon: <Smartphone className="inline-block mr-2" /> },
    { key: "email", icon: <Mail className="inline-block mr-2" /> },
    { key: "userId", icon: <Hash className="inline-block mr-2" /> },
    { key: "userName", icon: <User className="inline-block mr-2" /> },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            {labels?.modal?.title || "Complaint Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-500 transition bg-red-500 rounded-xl p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col gap-4">
          {fieldMap.map(({ key, icon }) => {
            const label = fields[key] || key.replace(/([A-Z])/g, " $1");
            const value = complaint?.[key] || "—";

            return (
              <div key={key} className="w-full text-green-800">
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  {icon}
                  <span className="capitalize font-semibold text-lg">
                    {label}:
                  </span>
                  <hr />
                  <span className="text-red-600 text-lg break-words font-bold">
                    {value}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Rejection Reason Block */}
          {rejectionReason?.trim() && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-2">
              <h3 className="text-red-600 font-bold text-lg mb-2">
                Rejection Reason
              </h3>
              <p className="text-gray-800 text-md whitespace-pre-line">
                {rejectionReason.trim() || "No reason provided by authority."}
              </p>
              <div className="mt-5 flex justify-end pr-4">
                <div className="text-lg font-semibold text-gray-700 text-left">
                  With Regards
                  <span className="text-red-500 block">
                    {district
                      ? `${district.charAt(0).toUpperCase()}${district.slice(1)} Authority`
                      : "District Authority"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
