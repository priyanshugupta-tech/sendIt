import { createBrowserRouter } from "react-router-dom";
import Auth from "../components/Auth";
import Verification from "../components/Verification";

export const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/otp",
    element: <Verification />,
  },
]);
