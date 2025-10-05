import React, { useState } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

const SecurityRowModal = ({ isOpen, onClose, onSuccess, clickedDistrict }) => {
  const {
    email: signedInEmail,
    userId: signedInUserId,
    district: signedInDistrict,
    userName: signedInUserName,
    role,
  } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const isIdentityValid =
      email.trim().toLowerCase() === signedInEmail.trim().toLowerCase() &&
      username.trim() === signedInUserName.trim() &&
      userId.trim() === signedInUserId.trim();

    console.log("Entered:", { email, username, userId });
    console.log("Signed In:", {
      signedInEmail,
      signedInUserId,
      signedInDistrict,
      role,
    });
    console.log("Clicked District:", clickedDistrict);

    if (!isIdentityValid) {
      setError("🚫 Identity mismatch. Please check your credentials.");
      return;
    }

    // ✅ State authority can access any district
    if (role === "state_Authority") {
      onSuccess(clickedDistrict.trim().toLowerCase());
      onClose();
      return;
    }

    // ✅ District authority must match their assigned district
    const normalizedSignedDistrict = signedInDistrict?.trim().toLowerCase();
    const normalizedClickedDistrict = clickedDistrict?.trim().toLowerCase();

    if (normalizedClickedDistrict === normalizedSignedDistrict) {
      onSuccess(normalizedClickedDistrict);
      onClose();
    } else {
      setError(
        `🚫 You don't have access to navigate to ${clickedDistrict} district.`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          Security Check 🔐
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Verify & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityRowModal;
