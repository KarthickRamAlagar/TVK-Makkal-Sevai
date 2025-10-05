import React from "react";
import { useNavigate } from "react-router-dom";

const AppIntroCard = ({
  title,
  paragraphs,
  points,
  imageSrc,
  buttonText,
  buttonLink,
  reverse = false, // if true, image left / text right
  language = "en", //  added language prop
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl flex flex-col lg:flex-row items-center justify-between p-8 mt-8 
        ${reverse ? "flex-row-reverse" : "flex-row"}
      `}
    >
      {/* Text Section */}
      <div className="flex-1 text-center lg:text-left mt-6 lg:mt-0">
        <h2 className="text-3xl sm:text-3xl md:text-4xl font-extrabold text-white">
          {title}
        </h2>

        {/* Paragraphs */}
        {paragraphs?.map((para, index) => (
          <p
            key={index}
            className="hidden md:block mt-4 text-white/95 text-lg leading-relaxed text-justify px-6"
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {/* Points */}
        <ul
          className={`text-white/95 ${
            language === "ta"
              ? "text-lg sm:text-medium md:text-medium"
              : "text-lg sm:text-lg md:text-lg"
          } space-y-3 px-2 sm:px-4 list-none mt-4 md:mt-5`}
        >
          {points?.map((point, index) => (
            <li
              key={index}
              className="relative pl-6 font-semibold leading-relaxed text-left break-words 
      before:content-[''] before:absolute before:left-0 before:top-2
      before:w-3 before:h-3 before:rounded-full before:bg-white before:border-2 before:border-red-500"
              dangerouslySetInnerHTML={{ __html: point }}
            />
          ))}
        </ul>
      </div>
      {/* Image Section */}
      <div className="flex-1 flex flex-col items-center justify-center mt-0">
        <img
          src={imageSrc}
          alt="App Preview"
          className="w-72 md:w-96 rounded-xl shadow-2xl"
        />
        {buttonText && buttonLink && (
          <h4
            className="mt-6 w-full max-w-[288px] md:max-w-[384px] text-2xl md:text-xl font-bold 
             text-white text-center bg-gradient-to-r from-yellow-400 to-red-600 
             py-2 rounded-lg shadow-lg"
          >
            {buttonText}
          </h4>
        )}
      </div>
    </div>
  );
};

export default AppIntroCard;
