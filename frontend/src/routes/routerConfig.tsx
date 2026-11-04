import { createBrowserRouter } from "react-router-dom";
import Auth from "../components/Auth";
import Verification from "../components/Verification";
import Dashboard from "../components/Dashboard";
import Search from "@/components/Search";
import DashboardInterface from "../components/DashboardInterface";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "search",
        element: <Search />,
      },
      {
        index: true,
        element: <DashboardInterface />,
      },
      //anyother route needed
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/otp",
    element: <Verification />,
  },
]);
