import React from "react";
import Navbar from "../components/common/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-600 to-yellow-400 px-3 sm:px-6 md:px-8">
      {/* Navbar: hide on /user-profile */}
      {location.pathname !== "/user-profile" && <Navbar />}

      {/* Page */}
      <main>
        <div className="pt-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
