import { useState, useEffect } from "react";
import { departmentTranslations } from "../../constants/i18nConstants/departmentTranslations";

const DepartmentAutocomplete = ({
  value,
  onChange,
  lang = "en",
  name = "department",
  placeholder = "Select your department",
}) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cache, setCache] = useState({});

  const departments = Object.values(departmentTranslations[lang].departments);

  const handleSelect = (district) => {
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
      const results = departments.filter((d) => d.toLowerCase().includes(key));
      setFilteredOptions(results);
      setCache((prev) => ({ ...prev, [key]: results }));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, departments, cache]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder={placeholder}
        className="border-2 border-red-500 focus:border-yellow-400 rounded-[50px] h-12 px-5 shadow-md hover:shadow-lg focus:shadow-xl outline-none w-full text-gray-700 font-medium"
      />
      {searchTerm && (
        <button
          type="button"
          className="absolute right-4 top-3 text-gray-500"
          onClick={() => setSearchTerm("")}
        >
          ✖
        </button>
      )}
      {showDropdown && filteredOptions.length > 0 && (
        <div
          className="absolute z-50 mt-2 w-full bg-white border border-yellow-400 rounded-xl shadow-lg max-h-40 overflow-y-auto mb-12"
          style={{ overscrollBehavior: "contain" }}
        >
          {filteredOptions.map((dept) => (
            <div
              key={dept}
              onMouseDown={() => handleSelect(dept)}
              className="px-4 py-1 hover:bg-yellow-100 cursor-pointer text-gray-800 capitalize"
            >
              {dept}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentAutocomplete;
