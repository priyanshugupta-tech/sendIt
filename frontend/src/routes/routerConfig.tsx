import { createBrowserRouter } from "react-router-dom";
import Auth from "../components/Auth";
import Verification from "../components/Verification";
import Dashboard from "../components/Dashboard";
import Search from "@/components/Search";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "search",
        element: <Search />,
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
