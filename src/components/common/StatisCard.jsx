//today and totall
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectGlobalStatCounts } from "@/redux/complaintSelectors";

const StatisCard = ({
  singleRowOnMd = false,
  twoColOnMd = false,
  smallFont = false,
}) => {
  const { t } = useTranslation();
  const globalCounts = useSelector(selectGlobalStatCounts);

  const dynamicCardData = [
    {
      id: 1,
      key: "raised",
      totalCount: globalCounts.raised || 0,
    },
    {
      id: 2,
      key: "pending",
      totalCount: globalCounts.pending || 0,
    },
    {
      id: 3,
      key: "resolved",
      totalCount: globalCounts.resolved || 0,
    },
    {
      id: 4,
      key: "reappealed",
      totalCount: globalCounts.reappealed || 0,
    },
  ];

  const emojiFallback = {
    raised: "🧑‍💻",
    pending: "🫡",
    resolved: "😟",
    reappealed: "😚",
  };

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

            const fallbackEmoji = emojiFallback[card.key];
            const countSizeClass = smallFont
              ? "text-5xl sm:text-4xl md:text-5xl"
              : "text-6xl sm:text-5xl md:text-7xl";

            const emojiStyle = {
              color: "#facc15",
              display: "inline-block",
            };

            return (
              <Card
                key={card.id}
                ref={ref}
                className="bg-white shadow-lg rounded-xl flex flex-col items-center justify-center p-4"
              >
                <CardContent className="flex flex-col items-center">
                  {/* Total Count Only */}
                  <h2
                    className={`${countSizeClass} font-extrabold text-center`}
                    style={{
                      backgroundImage:
                        card.totalCount > 0
                          ? "linear-gradient(to right, #dc2626, #facc15)"
                          : undefined,
                      backgroundClip: card.totalCount > 0 ? "text" : undefined,
                      WebkitBackgroundClip:
                        card.totalCount > 0 ? "text" : undefined,
                      WebkitTextFillColor:
                        card.totalCount > 0 ? "transparent" : undefined,
                    }}
                  >
                    {inView ? (
                      card.totalCount === 0 && fallbackEmoji ? (
                        <span style={emojiStyle}>{fallbackEmoji}</span>
                      ) : (
                        <>
                          <CountUp
                            end={card.totalCount}
                            duration={2.5}
                            separator=","
                          />
                          +
                        </>
                      )
                    ) : card.totalCount === 0 && fallbackEmoji ? (
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
                        "linear-gradient(to right, #dc2626, #facc15)",
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

export default StatisCard;
