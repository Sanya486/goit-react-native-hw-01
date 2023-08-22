import { createSlice } from "@reduxjs/toolkit";
import { loginDB, registerDB, logOut, getUserPhoto } from "./firebaseApi";



const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    data: null,
    userPhoto: '',
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
      }).addCase(getUserPhoto.fulfilled, (state, {payload})=> {
        state.userPhoto = payload
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
