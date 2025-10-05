//today
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserDetails,
  setUserRegistryEntry, // ✅ Inject registry entry
} from "../redux/userSlice";

import LandingTagline from "@/components/common/LandingTagline.jsx";
import StatisCard from "@/components/common/StatisCard.jsx";
import StateHeadCard from "@/components/common/StateHeadCard.jsx";
import JoinStateHeadCard from "@/components/common/JoinStateHeadCard.jsx";
import PoticalRoleModel from "@/components/common/PoticalRoleModel.jsx";
import Footer from "@/components/common/Footer.jsx";
import Alert from "../components/common/Alert.jsx";
import { useTranslation } from "react-i18next";
import IntroCard from "@/components/common/IntroCard";
import { isValidUserId } from "../utils/helpers";
import { store } from "../redux/store";
// import { sendReduxPayloadToKafka } from "../utils/kafkaSender";
const LandingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user || {});
  const userRegistry = userData?.userRegistry || {};
  const isSignedIn = userData?.isSignedIn || false;

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const signedIn = localStorage.getItem("tvkSignedIn") === "true";
    const hydrated = sessionStorage.getItem("tvkHydrated") === "true";
    const email = localStorage.getItem("tvkEmail")?.toLowerCase();
    const storedUserId = localStorage.getItem("tvkUserId");

    if (!signedIn || hydrated || !email) return;

    const registry = userRegistry || {};
    const userEntry = registry[email];

    if (!userEntry || Object.keys(registry).length === 0) return;

    let { userId, role } = userEntry;

    // ✅ Prefer registry userId if valid
    if (!isValidUserId(userId, role, email)) {
      if (isValidUserId(storedUserId, role, email)) {
        userId = storedUserId;
      } else {
        console.warn("⚠️ Invalid userId during hydration:", userId);
        return;
      }
    }

    // ✅ Inject user details into Redux
    dispatch(
      setUserDetails({
        ...userEntry,
        email,
        userId,
        isSignedIn: true,
        userRegistry,
        source: "LandingPage",
      })
    );

    // ✅ Inject registry entry to prevent regeneration
    dispatch(
      setUserRegistryEntry({
        userId,
        userData: {
          ...userEntry,
          email,
          userId,
          isSignedIn: true,
          lastActivity: new Date().toISOString(),
        },
      })
    );

    sessionStorage.setItem("tvkHydrated", "true");
  }, [dispatch, userRegistry]);

  useEffect(() => {
    const signedIn = localStorage.getItem("tvkSignedIn") === "true";
    const hydrated = sessionStorage.getItem("tvkHydrated") === "true";
    const email = localStorage.getItem("tvkEmail")?.toLowerCase();
    const storedUserId = localStorage.getItem("tvkUserId");

    if (!signedIn || hydrated || !email) return;

    const registry = userRegistry || {};
    const userEntry = registry[email];

    if (!userEntry || Object.keys(registry).length === 0) return;

    let { userId, role } = userEntry;

    if (!isValidUserId(userId, role, email)) {
      if (isValidUserId(storedUserId, role, email)) {
        userId = storedUserId;
      } else {
        console.warn("⚠️ Invalid userId during hydration:", userId);
        return;
      }
    }

    dispatch(
      setUserDetails({
        ...userEntry,
        email,
        userId,
        isSignedIn: true,
        userRegistry,
        source: "LandingPage",
      })
    );
    dispatch(
      setUserRegistryEntry({
        userId,
        userData: {
          ...userEntry,
          email,
          userId,
          isSignedIn: true,
          lastActivity: new Date().toISOString(),
        },
      })
    );

    sessionStorage.setItem("tvkHydrated", "true");

    // ✅ Send full Redux state to Kafka
    const fullState = store.getState();
    // sendReduxPayloadToKafka(fullState);
  }, [dispatch, userRegistry]);

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden px-4 md:px-8">
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <LandingTagline />
      <IntroCard />

      <StatisCard twoColOnMd={true} />
      <StateHeadCard />
      <JoinStateHeadCard />
      <PoticalRoleModel />
      <Footer />
    </div>
  );
};

export default LandingPage;
