// components/UserConsideration.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BellDot } from "lucide-react";
import { userNotificationsTranslations } from "../../constants/i18nConstants/userNotificationsTranslations";

const UserConsideration = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const userId = useSelector((state) => state.user.userId);

  const labels =
    userNotificationsTranslations[lang]?.labels ||
    userNotificationsTranslations.en.labels;

  const points =
    userNotificationsTranslations[lang]?.points ||
    userNotificationsTranslations.en.points;

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl flex flex-col p-8 mt-8 space-y-10">
      {/*  First Section  */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
        {/* Tagline */}
        <h2 className="text-lg md:text-4xl font-bold text-white flex items-center gap-3 md:gap-2">
          <img
            src="/assets/flag.jpg"
            alt="flag"
            className="w-10 h-10 object-contain mt-1"
          />
          {labels.thankYou}
        </h2>

        {/* User ID */}
        <div
          className={`text-white font-medium xl:pr-24 ${
            lang === "en" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
          }`}
        >
          {labels.userId}:{" "}
          <strong className="text-white px-2">
            {userId || "Not Available"}
          </strong>
        </div>
      </div>

      {/*  Second Section  */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">
        {/* Left Column → Subheading + Points */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Subheading with Bell icon */}
          <div className="flex items-center gap-2">
            <BellDot className="text-white w-7 h-7" />
            <h3 className="text-white text-xl font-bold">
              {labels.consideration}
            </h3>
          </div>

          {/* Points List */}
          <div className="text-white/95 text-lg sm:text-lg space-y-5 md:text-2xl px-1 sm:px-4">
            <ul
              className={`text-white/95 ${
                lang === "ta"
                  ? "text-medium sm:text-medium md:text-medium"
                  : "text-lg sm:text-lg md:text-2xl"
              } space-y-3 px-0 sm:px-4 list-none mt-4 md:mt-0`}
            >
              {points?.map((point, index) => (
                <li
                  key={index}
                  className={`relative pl-6 font-semibold leading-relaxed text-left ${
                    lang === "ta" ? "break-all hyphens-auto" : "break-words"
                  } before:content-[''] before:absolute before:left-0 before:top-2
before:w-3 before:h-3 before:rounded-full before:bg-white before:border-2 before:border-red-500`}
                  dangerouslySetInnerHTML={{ __html: point }}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column → Image + Motivational Tagline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <img
            src="/assets/B1.png"
            alt="TVK Motivation"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg max-h-81 object-contain xl:-mt-3"
          />

          <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug relative">
            <span className="text-5xl text-white font-serif absolute -left-6 -top-2">
              “
            </span>
            TVK Will Conquer It
            <span className="text-5xl text-white font-serif absolute -right-6 -bottom-2 ">
              ”
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default UserConsideration;
