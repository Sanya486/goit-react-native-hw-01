import { createSlice } from "@reduxjs/toolkit";
import { loginDB, registerDB, logOut } from "./firebaseApi";

const slice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    data: null,
    error: "",
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDB.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.data = payload;
        state.isLoading = false;
      }).addCase(loginDB.fulfilled, (state, {payload})=> {
        state.isLoggedIn = true;
        state.data = payload;
        state.isLoading = false;
      }).addCase(logOut.fulfilled, (state, {payload})=> {
        state.isLoggedIn = false
        state.data = null;
        state.isLoading = false
      })
      .addMatcher((action)=> action.type.endsWith('/pending'), (state)=>{
        state.isLoading = true
        state.error = ''
      }).addMatcher((action)=> action.type.endsWith('/rejected'), (state, {payload})=>{
        state.isLoading = false;
        state.error = payload;
      })
  },
});

export const userAuthReducer = slice.reducer;
