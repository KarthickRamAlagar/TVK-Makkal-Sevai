import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { DISTRICTS } from "../../constants/districts";
import { updateUserField } from "../../redux/userSlice";

const SecurityCheckModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    email: storedEmail,
    userName: storedUserName,
    userId: storedUserId,
    district: storedDistrict,
    role,
  } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const isIdentityValid =
      email.trim().toLowerCase() === storedEmail.trim().toLowerCase() &&
      username.trim() === storedUserName.trim() &&
      userId.trim() === storedUserId.trim();

    if (!isIdentityValid) {
      setError("🚫 Identity mismatch. Please check your credentials.");
      return;
    }

    if (role === "state_Authority") {
      if (!selectedDistrict) {
        setError("🚫 Please select a district to proceed.");
        return;
      }

      // ✅ Update Redux district for downstream selectors
      dispatch(updateUserField({ name: "district", value: selectedDistrict }));

      onSuccess(selectedDistrict.trim().toLowerCase());
      onClose();
      return;
    }

    const normalizedStoredDistrict = storedDistrict?.trim().toLowerCase();
    if (normalizedStoredDistrict) {
      onSuccess(normalizedStoredDistrict);
      onClose();
    } else {
      setError("🚫 You don't have access to any district.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
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

          {role === "state_Authority" && (
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select District</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

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

export default SecurityCheckModal;
