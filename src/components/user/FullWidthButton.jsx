import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetComplaintFields } from "../../redux/formSlice";
import { useTranslation } from "react-i18next";

const FullWidthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = () => {
    dispatch(resetComplaintFields());
    navigate("/complaint");
  };

  return (
    <div className="rounded-2xl w-full max-w-8xl flex flex-col p-8 md:mt-8 mb-5">
      <button
        onClick={handleClick}
        className="w-full flex flex-col md:flex-row items-center md:justify-center gap-3 px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-300 bg-white/20"
      >
        <img
          src="/assets/flag.jpg"
          alt="flag"
          className="w-14 h-14 object-contain mx-auto md:mx-0"
        />
        <span className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl -mt-2 text-white hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text">
          {t("raiseVoice.buttonText")}
        </span>
      </button>
    </div>
  );
};

export default FullWidthButton;
