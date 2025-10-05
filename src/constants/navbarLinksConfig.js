import {
  Languages,
  FileText,
  UserCircle,
  Shield,
  LayoutDashboard,
} from "lucide-react";

export const navbarLinks = [
  {
    id: "language",
    icon: Languages,
    type: "dropdown",
  },
  {
    id: "complaint",
    icon: FileText,
    route: "/complaint",
    type: "link",
  },
  {
    id: "districtStats", // dynamic route handled via modal
    icon: Shield,
    type: "link", // no static route here
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    route: "/authority", // static route
    type: "link",
  },
  {
    id: "profile",
    icon: UserCircle,
    route: "/user-profile",
    type: "link",
  },
];
