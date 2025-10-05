import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ThankYouScreen = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-6">
      <p className="text-2xl md:leading-relaxed sm:text-3xl md:text-4xl font-extrabold text-pink-600 hover:text-red-600 mb-4 md:mt-8">
        ஊழல் இல்லாத தமிழகத்தை உருவாக்க அனைவரும் வாரீர்
      </p>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6">
        #2026
      </h1>
      <button
        onClick={() => navigate(`/user/${userId}`)}
        className="bg-pink-600 text-white px-6 py-3 rounded-2xl hover:bg-pink-700 transition md:text-xl font-bold md:py-4"
      >
        View Your Complaint
      </button>
    </div>
  );
};

export default ThankYouScreen;
