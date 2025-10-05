// redux/resetAll.js
import { resetProofRegistry } from "./proofRegistrySlice";
import { resetDistrictRegistry } from "./districtRegistrySlice";
import { resetUser } from "./userSlice";
import { resetForm } from "./formSlice";

export const resetAllReduxState = () => (dispatch) => {
  dispatch(resetProofRegistry());
  dispatch(resetDistrictRegistry());
  dispatch(resetUser());
  dispatch(resetForm());
  console.log("🧹 Redux store fully reset.");
};

// localStorage.clear(); window.persistor.purge(); window.store.dispatch(window.resetAllReduxState());
