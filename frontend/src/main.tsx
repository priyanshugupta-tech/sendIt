import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "@/components/ui/provider";
import { Router } from "./routes/routerConfig.tsx";
import { RouterProvider } from "react-router-dom";
import { Provider as ContextProvider } from "react-redux";
import { store } from "./app/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider store={store}>
      <Provider>
        <RouterProvider router={Router} />
      </Provider>
    </ContextProvider>
  </StrictMode>,
);
