// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// import EfficiencyTagline from "@/components/district/Efficiency/EfficiencyTagline";
// import TopControls from "@/components/district/Efficiency/TopControls";
// import MainControls from "@/components/district/Efficiency/MainControls";
// import { DISTRICTS } from "@/constants/districts";
// import { selectFilteredComplaints } from "@/redux/complaintSelectors";
// import { selectAuthorityByDistrict } from "@/redux/complaintSelectors";
// import { selectMergedDistrictStats } from "@/redux/districtSelectors";

// import MailButton from "@/components/district/Efficiency/MailButton";

// const AuthorityEfficiency = () => {
//   const { districtName } = useParams();
//   const user = useSelector((state) => state.user);

//   const signedInDistrict = user?.district?.toLowerCase();
//   const signedInEmail = user?.email;
//   const signedInRole = user?.role;
//   const isSignedIn = user?.isSignedIn;

//   const [selectedDistrict, setSelectedDistrict] = useState(districtName || "");
//   const [selectedRange, setSelectedRange] = useState(
//     localStorage.getItem("selectedRange") || "today"
//   );
//   const [selectedStatus, setSelectedStatus] = useState(
//     localStorage.getItem("selectedStatus") || "All"
//   );

//   const isDistrictAuthority = signedInRole === "district_Authority";
//   const isLockedDistrict =
//     isDistrictAuthority &&
//     isSignedIn &&
//     signedInDistrict === selectedDistrict?.toLowerCase();

//   // Persist selections
//   useEffect(() => {
//     if (selectedDistrict) {
//       localStorage.setItem("selectedDistrict", selectedDistrict);
//     }
//   }, [selectedDistrict]);

//   useEffect(() => {
//     localStorage.setItem("selectedRange", selectedRange);
//   }, [selectedRange]);

//   useEffect(() => {
//     localStorage.setItem("selectedStatus", selectedStatus);
//   }, [selectedStatus]);

//   // ✅ Normalize once for selectors
//   const normalizedDistrict = selectedDistrict.toLowerCase();

//   // ✅ Get Redux data
//   const mergedStats = useSelector(selectMergedDistrictStats);
//   const complaints = useSelector(
//     selectFilteredComplaints(normalizedDistrict, selectedRange, selectedStatus)
//   );
//   const districtStats = mergedStats[normalizedDistrict];
//   const authorityData = useSelector(
//     selectAuthorityByDistrict(normalizedDistrict)
//   );
//   const allComplaints = useSelector(
//     selectFilteredComplaints(normalizedDistrict, selectedRange, "All")
//   );
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   // 🧪 Debug logs
//   console.log("🧾 Complaints:", complaints);
//   console.log("📊 District Stats:", districtStats);
//   console.log("🛡️ Authority Data:", authorityData);
//   console.log("🔐 Role:", signedInRole);
//   console.log("📍 Selected District:", selectedDistrict);
//   console.log("🔒 Locked Dropdown:", isLockedDistrict);

//   return (
//     <div className="w-full flex flex-col items-center overflow-x-hidden overflow-y-hidden px-4 md:px-8 min-h-screen">
//       <EfficiencyTagline />

//       <TopControls
//         selectedDistrict={selectedDistrict}
//         setSelectedDistrict={setSelectedDistrict}
//         selectedRange={selectedRange}
//         setSelectedRange={setSelectedRange}
//         districtOptions={DISTRICTS}
//         isLockedDistrict={isLockedDistrict}
//       />

//       <MainControls
//         complaints={complaints}
//         allComplaints={allComplaints}
//         selectedRange={selectedRange}
//         selectedStatus={selectedStatus}
//         setSelectedStatus={setSelectedStatus}
//         selectedDistrict={selectedDistrict}
//         authorityData={authorityData}
//       />
//       <MailButton
//         setShowAlert={setShowAlert}
//         setAlertMessage={setAlertMessage}
//       />
//     </div>
//   );
// };

// export default AuthorityEfficiency;

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import EfficiencyTagline from "@/components/district/Efficiency/EfficiencyTagline";
import TopControls from "@/components/district/Efficiency/TopControls";
import MainControls from "@/components/district/Efficiency/MainControls";
import { DISTRICTS } from "@/constants/districts";
import { selectFilteredComplaints } from "@/redux/complaintSelectors";
import { selectAuthorityByDistrict } from "@/redux/complaintSelectors";
import { selectMergedDistrictStats } from "@/redux/districtSelectors";

import MailButton from "@/components/district/Efficiency/MailButton";

const AuthorityEfficiency = () => {
  const { districtName } = useParams();
  const user = useSelector((state) => state.user);

  const signedInDistrict = user?.district?.toLowerCase();
  const signedInEmail = user?.email;
  const signedInRole = user?.role;
  const isSignedIn = user?.isSignedIn;

  const [selectedDistrict, setSelectedDistrict] = useState(districtName || "");
  const [selectedRange, setSelectedRange] = useState(
    localStorage.getItem("selectedRange") || "today"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.getItem("selectedStatus") || "All"
  );

  const isDistrictAuthority = signedInRole === "district_Authority";
  const isLockedDistrict =
    isDistrictAuthority &&
    isSignedIn &&
    signedInDistrict === selectedDistrict?.toLowerCase();

  // Persist selections
  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem("selectedDistrict", selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    localStorage.setItem("selectedRange", selectedRange);
  }, [selectedRange]);

  useEffect(() => {
    localStorage.setItem("selectedStatus", selectedStatus);
  }, [selectedStatus]);

  // ✅ Normalize once for selectors
  const normalizedDistrict = selectedDistrict.toLowerCase();

  // ✅ Get Redux data
  const mergedStats = useSelector(selectMergedDistrictStats);
  const complaints = useSelector(
    selectFilteredComplaints(normalizedDistrict, selectedRange, selectedStatus)
  );
  const districtStats = mergedStats[normalizedDistrict];
  const authorityData = useSelector(
    selectAuthorityByDistrict(normalizedDistrict)
  );
  const allComplaints = useSelector(
    selectFilteredComplaints(normalizedDistrict, selectedRange, "All")
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 🧪 Debug logs
  console.log("🧾 Complaints:", complaints);
  console.log("📊 District Stats:", districtStats);
  console.log("🛡️ Authority Data:", authorityData);
  console.log("🔐 Role:", signedInRole);
  console.log("📍 Selected District:", selectedDistrict);
  console.log("🔒 Locked Dropdown:", isLockedDistrict);

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden overflow-y-hidden px-4 md:px-8 min-h-screen">
      <EfficiencyTagline />

      <TopControls
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        districtOptions={DISTRICTS}
        isLockedDistrict={isLockedDistrict}
      />

      <MainControls
        complaints={complaints}
        allComplaints={allComplaints}
        selectedRange={selectedRange}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDistrict={selectedDistrict}
        authorityData={authorityData}
      />

      {/* ✅ Pass dynamic props to MailButton */}
      <MailButton
        authorityData={authorityData}
        allComplaints={allComplaints}
        selectedRange={selectedRange}
        setShowAlert={setShowAlert}
        setAlertMessage={setAlertMessage}
      />
    </div>
  );
};

export default AuthorityEfficiency;
