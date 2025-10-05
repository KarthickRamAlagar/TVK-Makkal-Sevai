import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetForm } from "@/redux/formSlice";

const IntroCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { role } = useSelector((state) => state.user);

  const isAuthority =
    role === "district_Authority" || role === "state_Authority";

  const buttonText = isAuthority
    ? "Empower Your Region"
    : t("landing.actionButton");

  const buttonRoute = isAuthority ? "/authority" : "/complaint";

  const handleClick = () => {
    if (!isAuthority) {
      dispatch(resetForm()); //  reset form for complaint flow
    }
    navigate(buttonRoute);
  };

  const paragraphs = t("landing.paragraphs", { returnObjects: true });
  const points = t("landing.politicalPoints", { returnObjects: true });

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl flex flex-col lg:flex-row items-center justify-between p-8 mt-8">
      {/* Right Section (Image + Button) */}
      <div className="flex-1 order-1 lg:order-2 mt-0 flex flex-col items-center justify-center">
        <img
          src="/assets/entry_image.png"
          alt="App Preview"
          className="w-72 md:w-96 rounded-xl shadow-2xl"
        />
        <Button
          className="mt-6 w-full max-w-[288px] md:max-w-[384px] py-3 rounded-lg text-white text-2xl md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-600 shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </div>

      {/* Left Section (Text Content) */}
      <div className="flex-1 order-2 lg:order-1 text-center lg:text-left mt-6 lg:mt-0">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white">
          {t("landing.appName")}
        </h2>

        {/* Paragraphs */}
        {paragraphs.map((para, index) => (
          <p
            key={index}
            className="mt-4 text-white/95 text-medium sm:text-lg md:text-xl leading-relaxed text-justify"
          >
            {para.map((item, i) => (
              <span key={i} className={item.bold ? "font-semibold" : ""}>
                {item.text}
              </span>
            ))}
          </p>
        ))}

        {/* Bullet Points */}
        <div className="mt-6 text-white/95 text-lg sm:text-medium md:text-2xl space-y-3 px-2 sm:px-4 text-center">
          {points.map((point, index) => (
            <p
              key={index}
              className="relative pl-6 font-semibold leading-relaxed text-left sm:text-justify before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:rounded-full before:bg-white before:border-2 before:border-red-500"
            >
              {point}.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroCard;
