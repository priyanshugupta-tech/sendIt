import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "./interfaces.ts";

const initialState: UserState = {
  isLoggedIn: false,
};

const userStateSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    updateUserState: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { updateUserState } = userStateSlice.actions;
export default userStateSlice.reducer;
