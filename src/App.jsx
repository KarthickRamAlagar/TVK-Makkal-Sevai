//today
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import EntryPage from "./pages/EntryPage";
import LandingPage from "./pages/LandingPage";
import MainLayout from "./layout/MainLayout";
import ProfilePage from "./pages/ProfilePage";
import Complaint from "./pages/Complaint";
import UserPage from "./pages/UserPage";
import DeveloperConsole from "./components/common/DeveloperConsole";
import AuthorityPage from "./pages/AuthorityPage";
import DistrictDashboardPage from "./pages/DistrictDashboardPage";
import AuthorityEfficiency from "./pages/AuthorityEfficiency";

import { persistor, store } from "./redux/store";
import { resetProofRegistry } from "./redux/proofRegistrySlice";
import { getDistrictFromEmail, cleanMalformedRegistry } from "./utils/helpers";
import { normalizeUserRegistry } from "./utils/registryUtils";
import {
  updateUserField,
  setUserRegistryEntry,
  setUserRegistry,
} from "./redux/userSlice";
import { useRegistryRebuild } from "./hooks/useRegistryRebuild";
import { resetAllReduxState } from "./redux/resetAll";

// Expose reset thunk to browser console
window.resetAllReduxState = resetAllReduxState;

function App() {
  const dispatch = useDispatch();
  const proofRegistry = useSelector((state) => state.proofRegistry);

  // Clear persisted state in dev mode (only once)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const hasCleared = localStorage.getItem("hasClearedProofRegistry");
      if (!hasCleared) {
        localStorage.clear();
        localStorage.setItem("hasClearedProofRegistry", "true");
        window.location.reload();
      }
    }
  }, []);

  // Reset proofRegistry once per session
  useEffect(() => {
    const hasReset = localStorage.getItem("proofRegistryReset");
    if (!hasReset) {
      dispatch(resetProofRegistry());
      localStorage.setItem("proofRegistryReset", "true");
    }
  }, [dispatch]);

  // Rebuild districtRegistry from proofRegistry after hydration
  useRegistryRebuild();

  // Patch district for current user if missing
  useEffect(() => {
    const state = store.getState();
    const { email, district, role } = state.user;

    if (
      role === "district_Authority" &&
      (!district || district === null || district === "")
    ) {
      const derivedDistrict = getDistrictFromEmail(email);
      if (derivedDistrict) {
        store.dispatch(
          updateUserField({ name: "district", value: derivedDistrict })
        );
        console.log("📌 District patched for authority:", derivedDistrict);
      }
    }
  }, []);

  // Clean and normalize registry before syncing
  useEffect(() => {
    const registry = store.getState().user?.userRegistry || {};
    const cleanedRegistry = cleanMalformedRegistry(registry);
    const normalizedRegistry = normalizeUserRegistry(cleanedRegistry);
    store.dispatch(setUserRegistry(normalizedRegistry));
  }, []);

  // Sync registry entries into Redux
  useEffect(() => {
    const registry = store.getState().user?.userRegistry || {};
    Object.entries(registry).forEach(([userId, userData]) => {
      dispatch(setUserRegistryEntry({ userId, userData }));
    });
  }, [dispatch]);

  // ✅ Patch current signed-in user into registry if missing or mismatched
  useEffect(() => {
    const currentEmail = localStorage.getItem("tvkEmail")?.toLowerCase();
    const currentUserId = localStorage.getItem("tvkUserId");

    if (currentEmail && currentUserId) {
      const registry = store.getState().user?.userRegistry || {};
      const entry = registry[currentEmail];

      if (!entry || entry.userId !== currentUserId) {
        const patchedEntry = {
          ...entry,
          email: currentEmail,
          userId: currentUserId,
          isSignedIn: true,
          lastActivity: new Date().toISOString(),
        };
        store.dispatch(
          setUserRegistryEntry({
            userId: currentUserId,
            userData: patchedEntry,
          })
        );
        console.log(
          "🔧 Patched registry entry during App hydration:",
          patchedEntry
        );
      }
    }
  }, []);

  // Registry integrity check (non-intrusive)
  useEffect(() => {
    const registry = store.getState().user?.userRegistry || {};
    const malformedEntries = Object.entries(registry).filter(
      ([email, entry]) => {
        const normalizedEmail = email.trim().toLowerCase();
        const userId = entry?.userId?.trim();
        const role = entry?.role;

        const isEmailAsId = userId === normalizedEmail;
        const missingId = !userId || isEmailAsId;
        const invalidRole = ![
          "user",
          "district_Authority",
          "state_Authority",
        ].includes(role);

        return missingId || invalidRole;
      }
    );

    if (malformedEntries.length > 0) {
      console.warn("⚠️ Malformed registry entries detected:", malformedEntries);
      malformedEntries.forEach(([email, entry]) => {
        const userId = entry?.userId;
        const role = entry?.role;
        console.log(`❌ Email: ${email}, userId: ${userId}, role: ${role}`);
      });
    } else {
      console.log("✅ All userRegistry entries are valid.");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route element={<MainLayout />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/user-profile" element={<ProfilePage />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/authority" element={<AuthorityPage />} />
          <Route
            path="/authority/:districtName"
            element={<DistrictDashboardPage />}
          />
          <Route
            path="/authorityEfficiency"
            element={<AuthorityEfficiency />}
          />
          <Route
            path="/authorityEfficiency/:districtName"
            element={<AuthorityEfficiency />}
          />
          <Route path="/dev-console" element={<DeveloperConsole />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
