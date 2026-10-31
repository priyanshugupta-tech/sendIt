import { createBrowserRouter } from "react-router-dom";
import Auth from "../components/Auth";
import Verification from "../components/Verification";
import Dashboard from "../components/dashboard";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
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
