import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { joinStateHeads } from "../../constants/JoinStateHeadConfig";
import { useTranslation } from "react-i18next";

const JoinStateHeadCard = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full px-4 md:px-8 mt-12 mb-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {joinStateHeads.map((head) => {
            const translated = t(`joinStateHeads.${head.id}`, {
              returnObjects: true,
              defaultValue: {},
            });

            return (
              <Card
                key={head.id}
                className="bg-white shadow-lg rounded-xl flex flex-col items-center justify-center p-4"
              >
                <CardContent className="flex flex-col items-center space-y-5">
                  <img
                    src={head.image}
                    alt={translated.name || head.name}
                    className="w-60 h-45 object-cover rounded-full drop-shadow-[0_10px_20px_rgba(255,0,0,0.35)]"
                  />

                  <h3
                    className="text-2xl md:text-2xl font-extrabold text-center bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #ff0000, #facc15)",
                    }}
                  >
                    {translated.name || head.name}
                  </h3>

                  <p
                    className="text-xl md:text-lg font-bold text-center bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #ff0000, #f472b6)",
                    }}
                  >
                    {translated.designation || head.designation}
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

export default JoinStateHeadCard;
