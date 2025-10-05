import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectStatsForDistrict } from "@/redux/districtSelectors";

const DistrictStatsCard = ({
  districtName,
  singleRowOnMd = false,
  twoColOnMd = false,
  smallFont = false,
}) => {
  const { t } = useTranslation();
  const districtStats = useSelector(selectStatsForDistrict(districtName));

  const keyMap = {
    totalcount: "raised",
    resolved: "resolved",
    pending: "pending",
    reappealed: "reappealed",
  };

  const emojiFallback = {
    raised: "🧑‍💻",
    pending: "🫡",
    resolved: "😟",
    reappealed: "😚",
  };

  const dynamicCardData = Object.entries(keyMap).map(
    ([reduxKey, translationKey], index) => ({
      id: index + 1,
      key: translationKey,
      count: districtStats?.[reduxKey] || 0,
    })
  );

  let gridClass = "md:grid-cols-4";
  if (singleRowOnMd) gridClass = `md:grid-cols-${dynamicCardData.length}`;
  else if (twoColOnMd) gridClass = "md:grid-cols-2";

  return (
    <div className="w-full px-4 md:px-8 mt-12 mb-4">
      <div className="max-w-screen-xl mx-auto">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
          {dynamicCardData.map((card) => {
            const { ref, inView } = useInView({
              triggerOnce: false,
              threshold: 0.3,
            });

            const isZero = card.count === 0;
            const fallbackEmoji = emojiFallback[card.key];

            const countSizeClass = smallFont
              ? "text-5xl sm:text-4xl md:text-5xl"
              : "text-6xl sm:text-5xl md:text-7xl";

            const emojiStyle = {
              color: "#facc15",
              display: "inline-block",
            };

            const isTotalRaised = card.key === "raised";
            const gradient = "linear-gradient(to right, #ff0000, #facc15)";

            return (
              <Card
                key={card.id}
                ref={ref}
                className="bg-white shadow-lg rounded-xl flex flex-col items-center justify-center p-4"
              >
                <CardContent className="flex flex-col items-center">
                  <h2
                    className={`${countSizeClass} font-extrabold text-center`}
                    style={{
                      backgroundImage:
                        !isZero || !fallbackEmoji ? gradient : undefined,
                      backgroundClip:
                        !isZero || !fallbackEmoji ? "text" : undefined,
                      WebkitBackgroundClip:
                        !isZero || !fallbackEmoji ? "text" : undefined,
                      WebkitTextFillColor:
                        !isZero || !fallbackEmoji ? "transparent" : undefined,
                    }}
                  >
                    {inView ? (
                      isZero && fallbackEmoji ? (
                        <span style={emojiStyle}>{fallbackEmoji}</span>
                      ) : (
                        <>
                          <CountUp
                            end={card.count}
                            duration={2.5}
                            separator=","
                          />
                          +
                        </>
                      )
                    ) : isZero && fallbackEmoji ? (
                      <span style={emojiStyle}>{fallbackEmoji}</span>
                    ) : (
                      "0+"
                    )}
                  </h2>

                  <p
                    className={`mt-2 ${
                      smallFont
                        ? "text-xl sm:text-xl md:text-2xl"
                        : "text-2xl sm:text-xl md:text-3xl"
                    } font-bold bg-clip-text text-transparent text-center`}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #ff0000, #f472b6)",
                    }}
                  >
                    {t(`landing.stats.${card.key}`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DistrictStatsCard;
