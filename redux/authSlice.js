import { createSlice } from "@reduxjs/toolkit";
import { loginDB, registerDB, logOut } from "./firebaseApi";

const slice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    uid: "",
    error: "",
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDB.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.uid = payload;
        state.isLoading = false;
      }).addCase(loginDB.fulfilled, (state, {payload})=> {
        state.isLoggedIn = true;
        state.uid = payload;
        state.isLoading = false;
      }).addCase(logOut.fulfilled, (state, {payload})=> {
        state.isLoggedIn = false;
        state.email= '';
        state.uid = '';

      })
      .addMatcher((action)=> action.type.endsWith('/pending', (state)=>{
        state.isLoading = true
        state.error = ''
      })).addMatcher((action)=> action.type.endsWith('/rejected', (state)=>{
        state.isLoading = false;
        state.error = payload;
      }))
  },
});

export const userAuthReducer = slice.reducer;
