import { createBrowserRouter } from "react-router-dom";

export const Router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("../components/Dashboard")).default,
    }),
    children: [
      {
        path: "search",
        lazy: async () => ({
          Component: (await import("@/components/Search")).default,
        }),
      },
      //anyother route needed
    ],
  },
  {
    path: "/auth",
    lazy: async () => ({
      Component: (await import("../components/Auth")).default,
    }),
  },
  {
    path: "/otp",
    lazy: async () => ({
      Component: (await import("../components/Verification")).default,
    }),
  },
]);
