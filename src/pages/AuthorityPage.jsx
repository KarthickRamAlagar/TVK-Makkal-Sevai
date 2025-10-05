import DistrictGuidelines from "@/components/authority/DistrictGuidelines";
import DistrictRegistryTable from "@/components/authority/DistrictRegistryTable";
import Footer from "@/components/common/Footer";
import LandingTagline from "@/components/common/LandingTagline";
import StatisCard from "@/components/common/StatisCard";
import { TaglineCarousel } from "@/components/authority/TaglineCarousel";
import React from "react";

const AuthorityPage = () => {
  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden px-4 md:px-8">
      {/* Tag line */}
      <LandingTagline />
      {/* Authority Instructions */}
      <DistrictGuidelines />
      {/* Carousol taglines  */}
      <StatisCard twoColOnMd={true} />
      <TaglineCarousel />
      {/* Districts table */}
      <DistrictRegistryTable />
      {/* Footer */}
      <Footer variant="authority" />
    </div>
  );
};

export default AuthorityPage;
