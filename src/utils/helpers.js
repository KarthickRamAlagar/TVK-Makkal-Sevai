export function getDistrictFromEmail(email) {
  if (!email?.startsWith("tvk")) return null;

  const namePart = email.split("@")[0]; // ex: tvkmadurai or tvkstateauthority
  const district = namePart.replace("tvk", "").toLowerCase();

  // Special case → state authority
  if (district === "stateauthority") {
    return "stateauthority";
  }

  return district; // -> madurai, etc.
}

export function validateDistrictSelection(email, selectedDistrict) {
  const district = getDistrictFromEmail(email);
  if (!district) return false;

  // Special case → state authority
  if (district === "stateauthority") {
    return selectedDistrict?.toLowerCase() === "stateauthority";
  }

  return district === selectedDistrict?.toLowerCase();
}

export function getRoleFromEmail(email) {
  if (!email) return "user";

  // Special case → state authority
  if (email.toLowerCase() === "tvkstateauthority@gmail.com") {
    return "state_Authority";
  }

  // Any district authority
  if (email.startsWith("tvk") && email.endsWith("@gmail.com")) {
    return "district_Authority";
  }

  return "user";
}

export function generateUserId(email, role, district = "") {
  const prefix = "tvk";
  const randomDigits = (length) =>
    Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0");

  if (role === "user") {
    return `${prefix}${randomDigits(3)}`;
  }

  if (role === "district_Authority") {
    const cleanDistrict = district.trim().toLowerCase().replace(/\s+/g, "");
    return `${prefix}${cleanDistrict}${randomDigits(3)}`;
  }

  if (role === "state_Authority") {
    return `${prefix}${randomDigits(5)}`;
  }

  return `${prefix}${randomDigits(4)}`; // fallback
}



export function formatFormData(formValues, userRegistry = {}) {
  const { userName, email, whatsapp } = formValues;
  const normalizedEmail = email?.trim().toLowerCase();

  const role = getRoleFromEmail(normalizedEmail);
  const district = getDistrictFromEmail(normalizedEmail);

  const existingEntry = userRegistry[normalizedEmail];
  let userId = existingEntry?.userId?.trim();
  const storedUserId = localStorage.getItem("tvkUserId")?.trim();

  // ✅ Prefer formValues.userId if valid
  if (isValidUserId(formValues.userId, role, normalizedEmail)) {
    userId = formValues.userId;
    console.log("📦 Reusing formValues.userId:", userId);
  }

  // ✅ Validate existing ID
  if (!isValidUserId(userId, role, normalizedEmail)) {
    userId = null;
  }

  // ✅ Prefer valid localStorage ID
  if (!userId && isValidUserId(storedUserId, role, normalizedEmail)) {
    userId = storedUserId;
    console.log("📦 Valid userId patched from localStorage:", storedUserId);
  }

  // ✅ Final fallback: generate fresh
  if (!userId) {
    userId = generateUserId(normalizedEmail, role, district);
    console.warn("⚠️ Generated new userId:", userId);
  }

  // ✅ Prevent accidental reuse across users
  const isDuplicateId = Object.values(userRegistry).some(
    (entry) => entry.userId === userId && entry.email !== normalizedEmail
  );
  if (isDuplicateId) {
    console.warn("🚨 Duplicate userId detected across registry:", userId);
    userId = generateUserId(normalizedEmail, role, district); // regenerate
  }

  const baseData = {
    userName,
    email: normalizedEmail,
    userId,
    district,
    role,
  };

  if (role === "user") {
    baseData.whatsapp = whatsapp;
  }

  return baseData;
}

// today
export const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getDistrictProofRows = (proofRegistry, districtName) => {
  const normalized = districtName.toLowerCase();
  const rows = [];

  Object.values(proofRegistry || {}).forEach((userProofs) => {
    Object.values(userProofs || {}).forEach(({ complaint, proofs }) => {
      if (!complaint || complaint.district?.toLowerCase() !== normalized)
        return;

      rows.push({
        date: complaint.timestamp,
        complaintId: complaint.complaintId,
        userName: complaint.userName,
        taluk: complaint.taluk,
        wardNo: complaint.wardNo,
        department: complaint.department,
        userId: complaint.userId,
        status: complaint.status,
        userFeedback: complaint.userFeedback,
        email: complaint.email,
        whatsapp: complaint.whatsapp,
        proofs,
      });
    });
  });

  return rows;
};

export function isValidUserId(userId, role, email) {
  if (!userId || typeof userId !== "string") return false;

  const normalized = userId.trim().toLowerCase();
  const emailPart = email?.trim().toLowerCase();

  if (role === "user") {
    return /^tvk\d{3}$/.test(normalized);
  }

  if (role === "district_Authority") {
    const district = getDistrictFromEmail(emailPart);
    return new RegExp(`^tvk${district}\\d{3}$`).test(normalized);
  }

  if (role === "state_Authority") {
    return /^tvk\d{5}$/.test(normalized);
  }

  return false;
}

export function cleanMalformedRegistry(registry = {}) {
  const cleaned = {};

  Object.entries(registry).forEach(([email, entry]) => {
    const normalizedEmail = email.trim().toLowerCase();
    const userId = entry?.userId;
    const role = entry?.role;

    const isEmailAsId = userId === normalizedEmail;
    const missingId = !userId || isEmailAsId;
    const validRole = [
      "user",
      "district_Authority",
      "state_Authority",
    ].includes(role);

    if (!missingId && validRole) {
      cleaned[normalizedEmail] = entry;
    } else {
      console.warn("🧹 Removing malformed entry:", normalizedEmail);
    }
  });

  return cleaned;
}
