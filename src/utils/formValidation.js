import { ADMIN_EMAILS } from "../constants/adminEmails";

export const validateForm = (data) => {
  const errors = {};

  // User Name
  if (!data.userName.trim()) {
    errors.userName = "User Name is required";
  } else if (data.userName.trim().length < 3) {
    errors.userName = "User Name must be at least 3 characters";
  }

  // Email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (
    !/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
  ) {
    errors.email = "Invalid email format";
  }

  const isAdmin = ADMIN_EMAILS.includes(data.email?.toLowerCase());

  // Whatsapp (only for user)
  if (!isAdmin) {
    if (!data.whatsapp || data.whatsapp.trim() === "") {
      errors.whatsapp = "Whatsapp is required";
    } else if (!/^\+?[0-9]{7,15}$/.test(data.whatsapp)) {
      errors.whatsapp = "Invalid Whatsapp number";
    }
  }

  // District (only for admin)
  if (isAdmin && (!data.district || data.district.trim() === "")) {
    errors.district = "District selection is required";
  }

  return errors;
};
