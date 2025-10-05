import DistrictAutocomplete from "@/components/common/DistrictAutocomplete";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopControls = ({
  selectedDistrict,
  setSelectedDistrict,
  selectedRange,
  setSelectedRange,
  districtOptions,
  isLockedDistrict,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDistrictChange = ({ name, value }) => {
    const newDistrict = value || "";
    setSelectedDistrict(newDistrict);
    navigate(`/authorityEfficiency/${newDistrict.toLowerCase()}`);
  };

  const timeOptions = [
    { key: "today", label: t("topControls.today") },
    { key: "15days", label: t("topControls.fifteenDays") },
    { key: "30days", label: t("topControls.thirtyDays") },
  ];

  return (
    <div className="rounded-2xl shadow-sm w-full max-w-8xl flex flex-col md:flex-row justify-between items-center gap-6 mt-12 px-6 py-6 mb-6">
      {/* District Selector */}
      <div className="w-full md:w-1/2">
        <DistrictAutocomplete
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={districtOptions}
          clearTriggersChange={true}
          disabled={isLockedDistrict}
          placeholder={t("topControls.districtPlaceholder")}
        />
      </div>

      {/* Time Range Radio Buttons */}
      <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap gap-4 justify-center items-center">
        {timeOptions.map(({ key, label }, index) => (
          <div
            key={key}
            className={`flex items-center justify-center ${
              index === 2 ? "w-full md:w-auto" : ""
            }`}
          >
            <label className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl text-white font-semibold cursor-pointer">
              <input
                type="radio"
                name="timeRange"
                className="w-7 h-7 accent-green-600 cursor-pointer"
                checked={selectedRange === key}
                onChange={() => setSelectedRange(key)}
              />
              <span className="leading-none whitespace-nowrap">{label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopControls;
