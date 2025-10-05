import React from "react";
import {
  Hash,
  Calendar,
  Landmark,
  Building2,
  Briefcase,
  User,
  IdCard,
  Mail,
  Smartphone,
  Flag,
  MessageSquare,
} from "lucide-react";

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const cleanSummary = (text) => {
  if (!text) return "";
  return text.replace(/Here's a summary of the feedback.*?:/i, "").trim();
};

const stripBullet = (line) => {
  return line.replace(/^\s*[•\-]+\s*/, "").trim();
};

const styleBoldGreen = (line) => {
  return line.replace(/<b>(.*?)<\/b>/gi, '<b class="text-green-500">$1</b>');
};

const safeRender = (key, value, districtName, status) => {
  if (value === null || value === undefined) return "—";

  if (key === "date") {
    const d = new Date(value);
    return d.toLocaleDateString("en-GB");
  }

  if (key === "taluk") {
    const rawTaluk = value?.trim().toLowerCase();
    const directions = ["north", "south", "east", "west"];
    const matchedDirection = directions.find(
      (dir) =>
        rawTaluk === dir || rawTaluk === `${districtName?.toLowerCase()} ${dir}`
    );
    return matchedDirection && districtName
      ? `${capitalize(districtName)} ${capitalize(matchedDirection)}`
      : value;
  }

  if (key === "userFeedback") {
    const normalizedStatus = status?.toLowerCase();
    const isPendingOrAppealed =
      normalizedStatus === "pending" || normalizedStatus === "appealed";

    if (typeof value === "string" && value.trim()) return value;

    if (value?.satisfied) {
      return `Satisfied${value.reason ? ` — ${value.reason}` : ""}`;
    }

    if (value?.reason) {
      return `Not Satisfied — ${value.reason}`;
    }

    if (isPendingOrAppealed) {
      return "Yet To Receive Feedback";
    }

    return "😔 No feedback provided";
  }

  if (typeof value === "object") return JSON.stringify(value);

  return value;
};

const DistrictDetailsModal = ({
  open,
  onClose,
  data,
  labels,
  districtName,
}) => {
  if (!open || !data) return null;

  const fields = labels?.modal?.fields || {};
  const complaint = data.complaint;

  const fieldMap = [
    { key: "complaintId", icon: <Hash className="inline-block mr-2" /> },
    { key: "date", icon: <Calendar className="inline-block mr-2" /> },
    { key: "taluk", icon: <Landmark className="inline-block mr-2" /> },
    { key: "wardNo", icon: <Building2 className="inline-block mr-2" /> },
    { key: "department", icon: <Briefcase className="inline-block mr-2" /> },
    { key: "userName", icon: <User className="inline-block mr-2" /> },
    { key: "userId", icon: <IdCard className="inline-block mr-2" /> },
    { key: "email", icon: <Mail className="inline-block mr-2" /> },
    { key: "whatsapp", icon: <Smartphone className="inline-block mr-2" /> },
    { key: "status", icon: <Flag className="inline-block mr-2" /> },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
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
            const rawValue = complaint?.[key];
            const value = safeRender(
              key,
              rawValue,
              districtName,
              complaint?.status
            );

            return (
              <div key={key} className="w-full text-green-800">
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  {icon}
                  <span className="capitalize font-semibold text-lg">
                    {label}:
                  </span>
                  <hr className="border-gray-600" />
                  <span className="text-red-600 text-lg break-words font-bold">
                    {value}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Feedback Field with Label and Scrollable Box */}
          <div className="w-full text-green-800">
            <div className="flex items-center gap-x-2 mb-2">
              <MessageSquare className="inline-block text-green-700" />
              <span className="capitalize font-semibold text-lg text-green-700">
                {fields.userFeedback || "User Feedback"}:
              </span>
              <span className="text-red-600 font-bold text-lg">
                {complaint?.userFeedback?.satisfied
                  ? "Satisfied — Add Reasons:"
                  : complaint?.userFeedback?.reason
                    ? "Not Satisfied — Add Reasons:"
                    : "—"}
              </span>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto text-base font-medium">
              {complaint?.userFeedback?.reason ? (
                <div className="flex flex-col gap-2">
                  <div className="text-green-600 font-bold text-lg">
                    Reasons:
                  </div>
                  <div className="text-green-700 whitespace-pre-wrap">
                    {cleanSummary(complaint.userFeedback.reason)
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <div
                          key={idx}
                          dangerouslySetInnerHTML={{
                            __html: styleBoldGreen(stripBullet(line)),
                          }}
                        />
                      ))}
                  </div>
                </div>
              ) : complaint?.userFeedback?.satisfied ? (
                <span className="text-red-600">
                  No additional feedback provided.
                </span>
              ) : complaint?.status?.toLowerCase() === "pending" ||
                complaint?.status?.toLowerCase() === "appealed" ? (
                <span className="text-red-600">🕒 Yet To Receive Feedback</span>
              ) : (
                <span className="text-red-600">😔 No feedback provided</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictDetailsModal;
