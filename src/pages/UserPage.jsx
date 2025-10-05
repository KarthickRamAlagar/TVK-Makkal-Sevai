import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import LandingTagline from "../components/common/LandingTagline";
import UserConsideration from "../components/user/UserConsideration";
import ComplaintRegistryTable from "@/components/user/ComplaintRegistryTable";
import FullWidthButton from "@/components/user/FullWidthButton";

import { selectAllComplaintsByUser } from "../redux/complaintSelectors";
import { updateUserField } from "../redux/userSlice";
import { getDistrictFromEmail } from "../utils/helpers";

const UserPage = () => {
  const dispatch = useDispatch();

  const { userId, email, district } = useSelector((state) => state.user);
  const complaints = useSelector(selectAllComplaintsByUser(userId));

  //  Patch missing district from email
  useEffect(() => {
    if (!district) {
      const derivedDistrict = getDistrictFromEmail(email);
      if (derivedDistrict) {
        dispatch(updateUserField({ name: "district", value: derivedDistrict }));
        console.log("📌 District patched for user:", derivedDistrict);
      }
    }
  }, [district, email, dispatch]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🧠 Logged-in userId:", userId);
      console.log("📋 All complaints:", complaints);
    }
  }, [userId, complaints]);

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden px-4 md:px-8">
      {/* Cinematic Tagline */}
      <LandingTagline />

      {/* User Consideration Notes */}
      <UserConsideration />

      {/* Complaint List */}
      <ComplaintRegistryTable complaints={complaints} />

      {/* Action Button */}
      <FullWidthButton />
    </div>
  );
};

export default UserPage;
