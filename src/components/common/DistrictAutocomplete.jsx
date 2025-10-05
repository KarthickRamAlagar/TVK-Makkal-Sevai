import { useState, useEffect } from "react";

const DistrictAutocomplete = ({
  value,
  onChange,
  options,
  name = "district",
  placeholder = "Select your district",
  clearTriggersChange = false,
  disabled = false, //  NEW: lock input and dropdown
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cache, setCache] = useState({});

  const handleSelect = (district) => {
    if (disabled) return; //  Block selection
    onChange({ name, value: district });
    setSearchTerm(district);
    setShowDropdown(false);
  };

  useEffect(() => {
    const key =
      typeof searchTerm === "string" ? searchTerm.toLowerCase().trim() : "";

    if (cache[key]) {
      setFilteredOptions(cache[key]);
      return;
    }

    const timer = setTimeout(() => {
      const results = options.filter((d) => d.toLowerCase().includes(key));
      setFilteredOptions(results);
      setCache((prev) => ({ ...prev, [key]: results }));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, options, cache]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        value={searchTerm}
        onChange={(e) => {
          if (!disabled) setSearchTerm(e.target.value);
        }}
        onFocus={() => {
          if (!disabled) setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className={`border-2 ${
          disabled
            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
            : "border-red-500 focus:border-yellow-400"
        } rounded-[50px] h-12 px-5 shadow-md hover:shadow-lg focus:shadow-xl outline-none w-full text-gray-700 font-medium`}
      />
      {!disabled && searchTerm && (
        <button
          className="absolute right-4 top-3 text-gray-500"
          onClick={() => {
            setSearchTerm("");
            if (clearTriggersChange) {
              onChange({ name, value: "" });
            }
          }}
        >
          ✖
        </button>
      )}
      {!disabled && showDropdown && filteredOptions.length > 0 && (
        <div
          className="absolute z-50 mt-2 w-full bg-white border border-yellow-400 rounded-xl shadow-lg max-h-40 overflow-y-auto mb-12"
          style={{ overscrollBehavior: "contain" }}
        >
          {filteredOptions.map((district) => (
            <div
              key={district}
              onMouseDown={() => handleSelect(district)}
              className="px-4 py-1 hover:bg-yellow-100 cursor-pointer text-gray-800 capitalize"
            >
              {district}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistrictAutocomplete;
