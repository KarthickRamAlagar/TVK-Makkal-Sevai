import React, { useState, useEffect } from "react";
import { Menu, X, Languages } from "lucide-react";
import { navbarLinks } from "../../constants/navbarLinksConfig";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageModal from "./LanguageModal";
import SecurityCheckModal from "../authority/SecurityCheckModal";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Alert from "./Alert";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const userData = useSelector((state) => state.user || {});
  const userId = userData?.userId;
  const isSignedIn = userData?.isSignedIn && !!userId;

  const proofRegistry = useSelector((state) => state.proofRegistry || {});
  const hasComplaint =
    !!proofRegistry[userId] && Object.keys(proofRegistry[userId]).length > 0;

  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "ta") return "Tamil";
    if (savedLang === "ur") return "Urdu";
    return "English";
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      import("../../i18n").then(({ default: i18n }) =>
        i18n.changeLanguage(savedLang)
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShowNav = currentScrollY <= 0 || currentScrollY < lastScrollY;
      setShowNav(shouldShowNav);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isOpen || isLanguageOpen ? "hidden" : "auto";
  }, [isOpen, isLanguageOpen]);

  const getVisibleLinks = () => {
    const role = userData?.role;

    const isEfficiencyPage =
      currentPath === "/authorityEfficiency" ||
      currentPath.startsWith("/authorityEfficiency/");

    if (isEfficiencyPage) {
      return ["language", "dashboard", "profile"]; //  Only these three
    }

    if (role === "district_Authority" || role === "state_Authority") {
      if (currentPath === "/authority") {
        return ["language", "districtStats", "profile"];
      }
      if (currentPath.startsWith("/authority/")) {
        return ["language", "dashboard", "profile"];
      }
      if (currentPath === "/landing") {
        return ["language", "dashboard", "profile"];
      }
    }

    if (!isSignedIn) {
      return ["language", "districtStats", "complaint", "profile"];
    }

    if (role === "user") {
      return hasComplaint
        ? ["language", "dashboard", "profile"]
        : ["language", "complaint", "profile"];
    }

    return ["language", "profile"];
  };

  const visibleLinks = navbarLinks.filter((link) =>
    getVisibleLinks().includes(link.id)
  );

  const handleProtectedNav = (link) => {
    const allowWithoutSignIn = ["profile", "language"];

    if (!isSignedIn && !allowWithoutSignIn.includes(link.id)) {
      setToastMessage("Please sign in to access this section 🧑‍💻");
      setShowToast(true);
      setTimeout(() => {
        navigate("/user-profile");
        setShowToast(false);
      }, 3000);
      return;
    }

    if (link.id === "dashboard") {
      if (
        userData.role === "district_Authority" ||
        userData.role === "state_Authority"
      ) {
        navigate("/authority");
      } else {
        navigate(`/user/${userId}`);
      }
      setIsOpen(false);
      return;
    }

    if (link.id === "districtStats") {
      if (currentPath === "/authority") {
        setIsSecurityModalOpen(true);
        setIsOpen(false);
        return;
      } else {
        navigate("/authority");
        setIsOpen(false);
        return;
      }
    }

    if (link.id === "language") {
      setIsLanguageOpen(true);
      setIsOpen(false);
      return;
    }

    if (link.route) {
      navigate(link.route);
      setIsOpen(false);
    }
  };

  return (
    <>


      <Alert
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <SecurityCheckModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={(district) => navigate(`/authority/${district}`)}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 transform transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-white rounded-b-2xl shadow-md">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center px-1 py-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/landing")}
            >
              <img
                src="/assets/B2.jpg"
                alt="Brand"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg shadow-md object-cover"
              />
              <h4 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
                {t("landing.appName")}
              </h4>
            </div>

            <div className="hidden md:flex items-center space-x-5">
              {visibleLinks.map((link) => {
                const Icon = link.icon;
                const label = t(`navbar.${link.id}`);

                return (
                  <button
                    key={link.id}
                    onClick={() => handleProtectedNav(link)}
                    className="flex items-center space-x-2 text-pink-500 font-semibold hover:text-red-600 transition"
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsLanguageOpen(true)}
                className="text-gray-700 hover:text-red-600 transition"
                aria-label="Change Language"
              >
                <Languages size={24} className="text-red-500" />
              </button>

              <button
                className="text-gray-800 pr-1"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-screen w-[70vw] bg-white shadow-2xl z-[9999] backdrop-blur-md transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-gray-700">
            <X size={28} className="text-yellow-500" />
          </button>
        </div>

        <div className="flex flex-col items-start mt-6 px-6 space-y-6">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const label = t(`navbar.${link.id}`);

            return (
              <button
                key={link.id}
                onClick={() => handleProtectedNav(link)}
                className="flex items-center space-x-4 font-bold text-xl text-gray-800 hover:text-red-600 transition-transform hover:scale-105"
              >
                <Icon className="text-red-500" size={26} />
                <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  {label}
                </span>
              </button>
            );
          })}

          <div className="flex flex-col items-center mt-8">
            <img
              src="/assets/B1.png"
              alt="Mobile Bottom"
              className="w-46 sm:w-40 md:w-58 drop-shadow-[0_4px_15px_rgba(255,0,0,0.5),0_0_15px_rgba(255,215,0,0.5)]"
              onClick={() => {
                navigate("/landing");
                setIsOpen(false);
              }}
            />
            <h4 className="mt-4 text-2xl sm:text-xl md:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-center md:text-left">
              {t("landing.tagline")}
            </h4>
          </div>
        </div>
      </div>

      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </>
  );
};

export default Navbar;
