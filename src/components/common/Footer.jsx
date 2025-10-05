import React, { useState, useEffect } from "react";
import { footerLinks } from "../../constants/footerLinksConfig";
import { useTranslation } from "react-i18next";

const Footer = ({ variant = "default" }) => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const [iconSize, setIconSize] = useState(26);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 768 ? 36 : 26); // mobile: 36, desktop: 26
    };
    handleResize(); // initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const baseBg =
    variant === "authority" ? "bg-white/20 backdrop-blur-md" : "bg-white";

  return (
    <footer
      className={`w-full ${baseBg} rounded-2xl shadow-md px-6 md:px-12 py-6 mb-6 mt-3`}
    >
      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start mb-4 md:mb-0">
          <h4
            className={`text-3xl sm:text-xl md:text-2xl font-extrabold tracking-wide bg-clip-text text-transparent text-center md:text-left ${
              variant === "authority"
                ? "bg-gradient-to-r from-red-600 to-red-600"
                : "bg-gradient-to-r from-red-600 to-yellow-400"
            }`}
          >
            {t("footer.tagline")}
          </h4>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex space-x-6">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-yellow-500 transition"
              >
                <Icon size={iconSize} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center py-3 border-t border-gray-200 text-xl mt-4 text-red-500">
        {t("footer.copyright", { year })}
      </div>
    </footer>
  );
};

export default Footer;
