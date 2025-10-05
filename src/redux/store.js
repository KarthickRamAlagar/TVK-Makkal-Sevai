

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import { resetAllReduxState } from "./resetAll";

// Reducers
import userReducer from "./userSlice";
import formReducer from "./formSlice";
import proofRegistryReducer from "./proofRegistrySlice";
import districtRegistryReducer from "./districtRegistrySlice";

//  Transform: Persist selected user fields
const userTransform = createTransform(
  (inboundState) => {
    const {
      userId,
      email,
      userName,
      whatsapp,
      role,
      district,
      isSignedIn,
      isFirstTime,
      userRegistry,
    } = inboundState;
    return {
      userId,
      email,
      userName,
      whatsapp,
      role,
      isSignedIn,
      isFirstTime,
      userRegistry,
      district,
    };
  },
  (outboundState) => ({
    ...outboundState,
    userRegistry: outboundState.userRegistry || {}, //  Ensure rehydration
  }),
  { whitelist: ["user"] }
);

//  Transform: Persist form fields including userRegistry
const formTransform = createTransform(
  (inboundState) => {
    const {
      userName,
      email,
      whatsapp,
      userId,
      department,
      district,
      taluk,
      wardNo,
      role,
      isSignedIn,
      isFirstTime,
      complaintId,
      userRegistry,
      complaintLetter,
      images,
    } = inboundState;

    return {
      userName,
      email,
      whatsapp,
      userId,
      department,
      district,
      taluk,
      wardNo,
      role,
      isSignedIn,
      isFirstTime,
      complaintId,
      userRegistry, //  Persist this
      complaintLetter,
      images,
    };
  },
  (outboundState) => ({
    ...outboundState,
    userRegistry: outboundState.userRegistry || {}, //  Ensure rehydration
  }),
  { whitelist: ["form"] }
);

//  Transform: Deep clone complaint + proofs
const proofRegistryTransform = createTransform(
  (inboundState) => {
    const transformed = {};
    for (const userId in inboundState) {
      transformed[userId] = {};
      for (const complaintId in inboundState[userId]) {
        const entry = inboundState[userId][complaintId];
        const complaint = { ...entry.complaint };
        const proofs = entry.proofs || {};
        transformed[userId][complaintId] = {
          complaint,
          proofs,
        };
      }
    }
    return transformed;
  },
  null,
  { whitelist: ["proofRegistry"] }
);

//  Transform: Pass-through for district stats
const districtRegistryTransform = createTransform(
  (inboundState) => inboundState,
  null,
  { whitelist: ["districtRegistry"] }
);

//  Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  form: formReducer,
  proofRegistry: proofRegistryReducer,
  districtRegistry: districtRegistryReducer,
});

//  Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "proofRegistry", "form", "districtRegistry"],
  transforms: [
    userTransform,
    proofRegistryTransform,
    districtRegistryTransform,
    formTransform, //  Added
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Logger middleware
const loggerMiddleware = (storeAPI) => (next) => (action) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🧾 ${action.type}`, action.payload);
  }
  return next(action);
};

//  Store setup
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(loggerMiddleware),
});

export const persistor = persistStore(store);
window.store = store;
window.persistor = persistor;
window.resetAllReduxState = resetAllReduxState;

//  Log normalized district registry
setTimeout(() => {
  const state = store.getState();
  const normalized = Object.fromEntries(
    Object.entries(state.districtRegistry || {}).map(([district, stats]) => [
      district,
      Object.fromEntries(
        Object.entries(stats || {}).map(([status, count]) => [
          status.trim().toLowerCase(),
          count,
        ])
      ),
    ])
  );
  console.log("🏙️ Normalized District Registry:", normalized);
}, 1500);

//  Hydration-safe log for userRegistry
persistor.subscribe(() => {
  console.log(
    " Final userRegistry (rehydrated):",
    store.getState().user.userRegistry
  );
});
