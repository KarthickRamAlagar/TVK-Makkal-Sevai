import React, { useState, useEffect } from "react";
import { stateHeads, stateHeadsMobile } from "../../constants/StateHeadConfig";
import { useTranslation } from "react-i18next";

const StateHeadCard = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headsToRender = isMobile ? stateHeadsMobile : stateHeads;

  return (
    <div className="w-full flex flex-col items-center space-y-10 mt-12">
      {headsToRender.map((head) => {
        const translated = t(`stateHeads.${head.id}`, {
          returnObjects: true,
          defaultValue: {},
        });

        const fallbackSayings = isMobile ? head.mobileSayings : head.sayings;
        const translatedSayings = isMobile
          ? translated.mobileSayings
          : translated.sayings;

        const sayings = Array.isArray(translatedSayings)
          ? translatedSayings
          : Array.isArray(fallbackSayings)
            ? fallbackSayings
            : [];

        return (
          <div
            key={head.id}
            className={`bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl 
              flex flex-col lg:flex-row items-center justify-between p-8 
              ${head.reverse ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Image */}
            <div className="flex-1 flex justify-center md:justify-center mb-6 md:mb-0 relative">
              <img
                src={head.image}
                alt={translated.name || head.name}
                className={`rounded-xl object-cover z-[20] drop-shadow-[0_10px_20px_rgba(255,0,0,0.35)] 
                  ${
                    head.id === 4
                      ? "w-96 md:w-[36rem] lg:w-[32rem] h-auto scale-x-[-1]"
                      : "w-82 md:w-98 lg:w-[26rem] h-auto"
                  }`}
              />
            </div>

            {/* Text Section */}
            <div
              className={`flex-1 text-center md:text-left ${
                head.reverse ? "md:mr-8" : "md:ml-8"
              }`}
            >
              <h3 className="mt-4 text-center md:text-left text-3xl sm:text-xl md:text-4xl font-extrabold tracking-wide bg-red-600 bg-clip-text text-transparent">
                {translated.name || head.name}
              </h3>

              <h4
                className="mt-3 text-center md:text-center text-2xl sm:text-xl md:text-3xl font-extrabold text-white relative inline-block"
                style={{ WebkitTextStroke: "0.8px red" }}
              >
                {translated.designation || head.designation}
                <span className="absolute left-0 -bottom-3 w-full h-0.5 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 rounded "></span>
              </h4>

              <ul className="text-white/95 text-xl sm:text-lg md:text-2xl space-y-4 px-2 sm:px-6 md:px-8 list-none text-start mt-2 md:mt-4">
                {sayings.map((say, idx) => (
                  <li
                    key={idx}
                    className="relative pl-6 font-semibold leading-relaxed
                      before:content-[''] before:absolute before:left-0 before:top-2
                      before:w-3 before:h-3 before:rounded-full before:bg-white before:border-2 before:border-red-500"
                    dangerouslySetInnerHTML={{ __html: say }}
                  />
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StateHeadCard;
