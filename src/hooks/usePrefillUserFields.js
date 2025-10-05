// hooks/usePrefillUserFields.js
import { useEffect } from "react";
import { updateField } from "../redux/formSlice";

export const usePrefillUserFields = (userData, dispatch) => {
  useEffect(() => {
    if (!userData) return;

    const {
      userName = "",
      email = "",
      whatsapp = "",
      userId = "",
      role = "user",
    } = userData;

    dispatch(updateField({ name: "userName", value: userName }));
    dispatch(updateField({ name: "email", value: email }));
    dispatch(updateField({ name: "whatsapp", value: whatsapp }));
    dispatch(updateField({ name: "userId", value: userId }));
    dispatch(updateField({ name: "role", value: role }));
  }, [userData, dispatch]);
};
