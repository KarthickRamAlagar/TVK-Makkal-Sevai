import {
  getRoleFromEmail,
  getDistrictFromEmail,
  generateUserId,
  isValidUserId,
} from "./helpers";

export function normalizeUserRegistry(registry = {}) {
  const normalized = {};

  Object.entries(registry).forEach(([email, entry]) => {
    const cleanEmail = email.trim().toLowerCase();
    const role = getRoleFromEmail(cleanEmail);
    const district = getDistrictFromEmail(cleanEmail);
    const fallbackUserId = generateUserId(cleanEmail, role, district);

    const incomingUserId = entry?.userId?.trim();
    const validUserId = isValidUserId(incomingUserId, role, cleanEmail)
      ? incomingUserId
      : fallbackUserId;

    normalized[cleanEmail] = {
      userName: entry?.userName || "",
      email: cleanEmail,
      userId: validUserId,
      district,
      role,
      whatsapp: entry?.whatsapp || "",
      isSignedIn: entry?.isSignedIn || false,
      lastActivity: entry?.lastActivity || new Date().toISOString(),
    };
  });

  return normalized;
}
