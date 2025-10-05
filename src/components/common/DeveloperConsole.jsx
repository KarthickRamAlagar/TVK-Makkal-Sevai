import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const DeveloperConsole = () => {
  const districtRegistry = useSelector((state) => state.districtRegistry);
  const proofRegistry = useSelector((state) => state.proofRegistry);
  const userRegistry = useSelector((state) => state.user.userRegistry);
  const reduxUser = useSelector((state) => state.user);
  const isHydrated = useSelector((state) => state._persist?.rehydrated);

  useEffect(() => {
    if (isHydrated) {
      console.log("🧠 Full User Registry (hydrated):", userRegistry);
    }
  }, [isHydrated, userRegistry]);
  const localEmail = localStorage.getItem("tvkEmail")?.toLowerCase();
  const localUserId = localStorage.getItem("tvkUserId");
  const localSignedIn = localStorage.getItem("tvkSignedIn");

  const registryEntry = userRegistry?.[localEmail];
  const registryUserId = registryEntry?.userId;

  const mismatch =
    reduxUser?.userId && registryUserId && reduxUser.userId !== registryUserId;

  const malformedCount = Object.entries(userRegistry || {}).filter(
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
  ).length;

  return (
    <div
      style={{
        padding: "1rem",
        background: "#111",
        color: "#0f0",
        fontFamily: "monospace",
        overflowX: "auto",
      }}
    >
      <h2>🧪 Developer Console</h2>
      <p>Hydration Status: {isHydrated ? "✅ Rehydrated" : "⏳ Waiting..."}</p>

      <h3>🧍 Redux User</h3>
      <pre>
        {JSON.stringify(
          {
            userId: reduxUser.userId,
            email: reduxUser.email,
            role: reduxUser.role,
            district: reduxUser.district,
            isSignedIn: reduxUser.isSignedIn,
          },
          null,
          2
        )}
      </pre>

      <h3>📦 LocalStorage Snapshot</h3>
      <pre>
        {JSON.stringify(
          {
            tvkEmail: localEmail,
            tvkUserId: localUserId,
            tvkSignedIn: localSignedIn,
          },
          null,
          2
        )}
      </pre>

      <h3>🧠 Registry Entry for Current Email</h3>
      <pre>{JSON.stringify(registryEntry || {}, null, 2)}</pre>

      {mismatch && (
        <p style={{ color: "#ff0" }}>
          ⚠️ Mismatch detected: Redux userId ≠ Registry userId
        </p>
      )}

      <p>
        🧾 Registry Summary: {Object.keys(userRegistry || {}).length} entries
      </p>
      <p>⚠️ Malformed Entries: {malformedCount}</p>

      <h3>🏙️ District Registry</h3>
      <pre>{JSON.stringify(districtRegistry, null, 2)}</pre>

      <h3>📁 Proof Registry</h3>
      <pre>{JSON.stringify(proofRegistry, null, 2)}</pre>

      <h3>🧠 Full User Registry</h3>
      <pre>{JSON.stringify(userRegistry, null, 2)}</pre>
    </div>
  );
};

export default DeveloperConsole;
