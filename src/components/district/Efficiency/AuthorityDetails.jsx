import React from "react";
import { Hash, Mail, MapPin, Shield, ShieldUser } from "lucide-react";
import InfoRow from "./InfoRow";

const AuthorityDetails = ({ authorityData, selectedDistrict }) => {
  const isEmptySelection = !selectedDistrict?.trim();

  if (isEmptySelection) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
        <ShieldUser size={128} className="text-green-600 mb-4" />
        <p className="text-xl font-semibold text-gray-700">
          District Authority
        </p>
      </div>
    );
  }

  if (!authorityData) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-green-500 bg-clip-text text-transparent mb-2">
          Authority Details
        </h2>
        <p className="text-gray-500">No authority found for this district.</p>
      </div>
    );
  }

  const {
    userName,
    district,
    userId,
    email,
    role = "District Authority",
  } = authorityData;

  const AUTHORITY_DETAILS = [
    {
      icon: <ShieldUser size={22} />,
      label: "Authority Name",
      value: userName,
    },
    {
      icon: <MapPin size={22} />,
      label: "Authorized District",
      value: district,
    },
    { icon: <Hash size={22} />, label: "Authority ID", value: userId },
    { icon: <Mail size={22} />, label: "Email", value: email },
    { icon: <Shield size={22} />, label: "Role", value: role },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-6 pr-6 min-w-max">
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-500 to-green-500 bg-clip-text text-transparent mb-2">
          Authority Details
        </h2>
        {AUTHORITY_DETAILS.map(({ icon, label, value }) => (
          <InfoRow key={label} icon={icon} label={label} value={value} />
        ))}
      </div>
    </div>
  );
};

export default AuthorityDetails;
