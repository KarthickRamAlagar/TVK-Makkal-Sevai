import React, { useEffect, useMemo, useState } from "react";
import { Mail, Smartphone, User, Hash, MapPin, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Alert from "./Alert";
import { getDistrictFromEmail, getRoleFromEmail } from "../../utils/helpers";

const UserDetails = ({ handleSignOut }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  //  Read directly from Redux

  const userData = useSelector((state) => state.user);
  const generatedId = userData.userId;

  const isSignedIn = userData.isSignedIn;

  const role = useMemo(
    () => getRoleFromEmail(userData.email),
    [userData.email]
  );
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (isSignedIn && userData.userId) {
      console.log("🧾 User ID from Redux:", userData.userId);
    }
  }, [isSignedIn, userData.userId]);

  useEffect(() => {
    const baseMessage = "Keep your User Credentials Confidential";

    const roleMessages = {
      user: [
        "Shall We Raise your voice",
        "Your voice matters",
        "Stay connected with your district",
      ],
      district_Authority: ["District insights secured", "Empower your region"],
      state_Authority: ["State-level access granted", "Lead with transparency"],
    };

    const allMessages = [baseMessage, ...(roleMessages[role] || [])];
    setAlertQueue(allMessages);

    let index = 0;

    const showNextAlert = () => {
      if (index < allMessages.length) {
        setCurrentAlert(allMessages[index]);
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          index++;
          showNextAlert();
        }, 2500);
      }
    };

    showNextAlert();

    return () => {
      setAlertQueue([]);
      setCurrentAlert("");
      setShowAlert(false);
    };
  }, [navigate, role]);
  console.log("🧾 User ID from Redux:", userData.userId);

  return (
    <>
      <Alert
        message={currentAlert}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <div className="flex flex-col gap-6">
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold tracking-wide text-red-600">
          {t("userDetails.heading")}
        </h2>

        <div className="flex flex-col gap-5">
          {[
            {
              label: t("userDetails.labels.userName"),
              value: userData.userName,
              icon: <User size={28} />,
            },
            {
              label: t("userDetails.labels.email"),
              value: userData.email,
              icon: <Mail size={28} />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4"
            >
              <span className="flex items-center gap-2 font-bold text-red-600 text-xl sm:text-2xl md:text-xl">
                {icon}
                {label}:
              </span>
              <span className="text-yellow-600 font-bold text-xl sm:text-2xl md:text-xl">
                {value || "—"}
              </span>
            </div>
          ))}

          {/* Role-specific fields */}
          {role === "state_Authority" && (
            <>
              <InfoRow
                icon={<Hash size={28} />}
                label={t("userDetails.labels.adminId")}
                value={userData.userId || "Not assigned"}
              />
              <InfoRow
                icon={<Shield size={28} />}
                label={t("userDetails.labels.role")}
                value={t("userDetails.labels.stateAuthority")}
              />
            </>
          )}

          {role === "district_Authority" && (
            <>
              <InfoRow
                icon={<Hash size={28} />}
                label={t("userDetails.labels.adminId")}
                value={userData.userId || "Not assigned"}
              />
              <InfoRow
                icon={<Shield size={28} />}
                label={t("userDetails.labels.role")}
                value={t("userDetails.labels.districtAuthority")}
              />
              <InfoRow
                icon={<MapPin size={28} />}
                label={t("userDetails.labels.district")}
                value={
                  userData.district ||
                  getDistrictFromEmail(userData.email) ||
                  "—"
                }
              />
            </>
          )}

          {role === "user" && (
            <>
              <InfoRow
                icon={<Shield size={28} />}
                label={t("userDetails.labels.role")}
                value={t("userDetails.labels.user")}
              />
              <InfoRow
                icon={<Hash size={28} />}
                label={t("userDetails.labels.userId")}
                value={userData.userId || "Not assigned"}
              />
              <InfoRow
                icon={<Smartphone size={28} />}
                label={t("userDetails.labels.whatsapp")}
                value={userData.whatsapp || "—"}
              />
            </>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-6 py-3 text-lg rounded-[50px] hover:bg-red-600 transition shadow-md hover:shadow-lg mt-4"
        >
          {t("userDetails.signOut")}
        </button>
      </div>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
    <span className="flex items-center gap-2 font-bold text-red-600 text-xl sm:text-2xl md:text-xl">
      {icon}
      {label}:
    </span>
    <span className="text-yellow-600 font-bold text-xl sm:text-2xl md:text-xl">
      {value}
    </span>
  </div>
);

export default UserDetails;
