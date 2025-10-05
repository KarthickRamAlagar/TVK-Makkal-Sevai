import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserField,
  setUserDetails,
  setUserRegistryEntry,
} from "../../redux/userSlice";
import { useTranslation } from "react-i18next";

import { ADMIN_EMAILS } from "../../constants/adminEmails";
import { DISTRICTS } from "../../constants/districts";
import {
  validateDistrictSelection,
  formatFormData,
  getRoleFromEmail,
  isValidUserId,
} from "../../utils/helpers";

import Alert from "./Alert";
import DistrictAutocomplete from "./DistrictAutocomplete";

const ProfileForm = ({
  errors,
  touched,
  isSubmitted,
  handleBlur,
  handleSignUp,
  isFirstTime,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user || {});

  const [isAdmin, setIsAdmin] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const currentEmail = userData.email?.toLowerCase();
    setIsAdmin(ADMIN_EMAILS.includes(currentEmail));
    setRole(getRoleFromEmail(currentEmail));
  }, [userData.email]);

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e?.target || e;
    if (typeof name === "string" && value !== undefined) {
      dispatch(updateUserField({ name, value }));
    } else {
      console.warn("Invalid handleChange input:", e);
    }
  };

  const handleFormSubmit = () => {
    if (isAdmin && role !== "state_Authority") {
      if (!userData.district) {
        triggerAlert(t("profileForm.errors.requiredDistrict"));
        return;
      }

      const valid = validateDistrictSelection(
        userData.email,
        userData.district
      );

      if (!valid) {
        triggerAlert(t("profileForm.errors.invalidDistrict"));
        return;
      }
    }

    const emailKey = userData.email?.toLowerCase();
    const users = JSON.parse(localStorage.getItem("tvkUsers")) || {};
    const existingUser = users[emailKey];
    let stableUserId = existingUser?.userId;

    // ✅ Reuse valid userId if present
    if (!isValidUserId(stableUserId, role, emailKey)) {
      stableUserId = undefined;
    }

    // ✅ Format data with stable or regenerated userId
    const finalData = formatFormData(
      { ...userData, role, userId: stableUserId, isSignedIn: true },
      users
    );

    // ✅ Persist session in localStorage
    localStorage.setItem("tvkSignedIn", "true");
    localStorage.setItem("tvkEmail", finalData.email);
    localStorage.setItem("tvkUserId", finalData.userId);

    // ✅ Persist registry entry in tvkUsers
    users[finalData.email] = finalData;
    localStorage.setItem("tvkUsers", JSON.stringify(users));

    // ✅ Update Redux
    dispatch(setUserDetails(finalData));
    dispatch(
      setUserRegistryEntry({ userId: finalData.userId, userData: finalData })
    );

    // ✅ Trigger external sign-up logic
    handleSignUp(finalData);
  };

  const fields = isFirstTime ? ["userName", "email"] : ["userName", "email"];

  return (
    <div className="flex flex-col gap-4">
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <h1 className="text-xl sm:text-xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
        {t("profileForm.welcome")}
      </h1>

      {fields.map((field) => (
        <div key={field} className="flex flex-col">
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            placeholder={t(`profileForm.${field}`)}
            value={userData[field] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border-2 border-red-500 focus:border-yellow-400 rounded-[50px] h-12 px-5 shadow-md hover:shadow-lg focus:shadow-xl transform transition-transform duration-200 hover:scale-105 focus:scale-105 outline-none"
          />
          {(touched[field] || isSubmitted) && errors[field] && (
            <span className="text-red-600 text-sm ml-2 mt-2">
              {errors[field]}
            </span>
          )}
        </div>
      ))}

      {isAdmin && (
        <div className="flex flex-col relative">
          {role === "state_Authority" ? (
            <div className="px-5 py-3 border-2 border-yellow-400 rounded-[50px] bg-gray-100 text-gray-700 font-semibold shadow-md">
              {t("profileForm.stateAuthority")}
            </div>
          ) : (
            <DistrictAutocomplete
              value={userData.district || ""}
              onChange={handleChange}
              options={DISTRICTS}
              name="district"
              placeholder={t("profileForm.district")}
            />
          )}
        </div>
      )}

      {!isAdmin && isFirstTime && (
        <div className="flex flex-col">
          <input
            type="text"
            name="whatsapp"
            placeholder={t("profileForm.whatsapp")}
            value={userData.whatsapp || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border-2 border-red-500 focus:border-yellow-400 rounded-[50px] h-12 px-5 shadow-md hover:shadow-lg focus:shadow-xl outline-none"
          />
          {(touched.whatsapp || isSubmitted) && errors.whatsapp && (
            <span className="text-red-600 text-sm ml-2 mt-2">
              {errors.whatsapp}
            </span>
          )}
        </div>
      )}

      <button
        onClick={handleFormSubmit}
        className="bg-red-500 text-white px-6 py-3 text-lg rounded-[50px] hover:bg-red-600 transition shadow-md hover:shadow-lg mt-4"
      >
        {isFirstTime ? t("profileForm.signup") : t("profileForm.signin")}
      </button>
    </div>
  );
};

export default ProfileForm;
