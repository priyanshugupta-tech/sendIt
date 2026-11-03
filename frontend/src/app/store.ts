import { configureStore } from "@reduxjs/toolkit";
import userState from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    userState,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
