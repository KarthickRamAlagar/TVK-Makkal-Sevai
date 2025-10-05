

// today
import { createSlice } from "@reduxjs/toolkit";
import {
  getDistrictFromEmail,
  getRoleFromEmail,
  generateUserId,
  isValidUserId,
} from "../utils/helpers";

const initialState = {
  userId: "",
  email: "",
  userName: "",
  whatsapp: "",
  district: null,
  role: "user",
  isSignedIn: false,
  isFirstTime: true,
  userRegistry: {}, // Registry of known users
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      console.log("🧾 setUserDetails called from:", action.payload?.source);
      const incomingEmail = action.payload?.email?.trim().toLowerCase();
      if (!incomingEmail) return;

      const registryEntry = state.userRegistry?.[incomingEmail] || {};
      const fallbackData = action.payload || {};
      const role = getRoleFromEmail(incomingEmail);
      const district = getDistrictFromEmail(incomingEmail);

      // ✅ Prefer fallbackData.userId if valid
      let userId = null;
      if (
        fallbackData?.userId &&
        isValidUserId(fallbackData.userId, role, incomingEmail)
      ) {
        userId = fallbackData.userId;
        console.log("📦 Using fallbackData.userId:", userId);
      }

      // ✅ Otherwise prefer registry entry if valid
      const source =
        userId && fallbackData?.email === incomingEmail
          ? fallbackData
          : isValidUserId(registryEntry?.userId, role, incomingEmail) &&
              registryEntry?.email === incomingEmail
            ? registryEntry
            : fallbackData;

      // ✅ Final fallback: validate or regenerate
      const incomingUserId = source?.userId?.trim();
      if (!userId) {
        userId = isValidUserId(incomingUserId, role, incomingEmail)
          ? incomingUserId
          : generateUserId(incomingEmail, role, district);
      }

      // ✅ Prevent accidental reuse across users
      const isDuplicateId = Object.entries(state.userRegistry || {}).some(
        ([existingEmail, entry]) =>
          entry.userId === userId && existingEmail !== incomingEmail
      );
      if (isDuplicateId) {
        console.warn("🚨 Duplicate userId detected across registry:", userId);
        userId = generateUserId(incomingEmail, role, district); // regenerate
      }

      // ✅ Update current user slice
      Object.assign(state, {
        userName: source?.userName || "",
        email: incomingEmail,
        whatsapp: source?.whatsapp || "",
        role,
        district,
        userId,
        isSignedIn: true,
      });

      // ✅ Overwrite registry entry with latest metadata
      state.userRegistry[incomingEmail] = {
        userName: source?.userName || "",
        email: incomingEmail,
        userId,
        district,
        role,
        whatsapp: source?.whatsapp || "",
        isSignedIn: true,
        lastActivity: new Date().toISOString(),
      };
    },

    updateUserField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    setSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },

    setFirstTime: (state, action) => {
      state.isFirstTime = action.payload;
    },

    setUserRegistry: (state, action) => {
      state.userRegistry = action.payload;
    },

    setUserRegistryEntry: (state, action) => {
      const { userId, userData } = action.payload;
      if (!userId || !userData) return;

      const emailKey = userData.email?.trim().toLowerCase();
      if (!emailKey) {
        console.warn(
          "⚠️ setUserRegistryEntry called without valid email:",
          userData
        );
        return;
      }

      const district = getDistrictFromEmail(emailKey);
      const role = getRoleFromEmail(emailKey);

      let validUserId = isValidUserId(userId, role, emailKey)
        ? userId
        : generateUserId(emailKey, role, district);

      // ✅ Prevent accidental reuse across users
      const isDuplicateId = Object.entries(state.userRegistry || {}).some(
        ([existingEmail, entry]) =>
          entry.userId === validUserId && existingEmail !== emailKey
      );
      if (isDuplicateId) {
        console.warn(
          "🚨 Duplicate userId detected across registry:",
          validUserId
        );
        validUserId = generateUserId(emailKey, role, district); // regenerate
      }

      state.userRegistry[emailKey] = {
        ...userData,
        email: emailKey,
        district,
        role,
        userId: validUserId,
        lastActivity: new Date().toISOString(),
      };

      // ✅ Sync Redux userId if this is the current user
      if (state.email === emailKey && state.userId !== validUserId) {
        console.log("🔄 Syncing Redux userId with registry entry");
        state.userId = validUserId;
      }
    },

    resetUser: () => initialState,
  },
});

export const {
  setUserDetails,
  updateUserField,
  setSignedIn,
  setFirstTime,
  setUserRegistry,
  setUserRegistryEntry,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
