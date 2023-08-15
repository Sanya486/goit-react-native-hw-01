import { createSlice } from "@reduxjs/toolkit";
import { registerDB } from "../firebaseApi";

const slice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    email: "",
    error: "",
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDB.pending, (state, { payload }) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(registerDB.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.email = payload;
        state.isLoading = false;
      })
      .addCase(registerDB.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const userAuthReducer = slice.reducer;
