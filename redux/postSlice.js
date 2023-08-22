import { createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  getAllposts,
  getAllpostsImages,
  logOut,
  uploadPhototoFirestore,
  writeDataToFirestore,
} from "./firebaseApi";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    postsData: [],
    postsImages: [],
    postComents: [],
    IsLoading: "false",
    error: "",
  },
  reducers: {
    addPostsToRedux: (state, { payload }) => {
      state.postsData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(writeDataToFirestore.pending, (state, { payload }) => {
        state.IsLoading = true;
      })
      .addCase(writeDataToFirestore.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(getAllposts.pending, (state) => {
        state.IsLoading = true;
        state.error = "";
      })
      .addCase(getAllposts.fulfilled, (state, { payload }) => {
        state.postsData = payload;
        state.IsLoading = false;
      })
      .addCase(getAllposts.rejected, (state, { payload }) => {
        state.error = payload;
        state.IsLoading = false;
      })
      .addCase(getAllpostsImages.pending, (state) => {
        state.IsLoading = true;
        state.error = "";
      })
      .addCase(getAllpostsImages.fulfilled, (state, { payload }) => {
        state.postsImages = payload;
        state.IsLoading = false;
      })
      .addCase(getAllpostsImages.rejected, (state, { payload }) => {
        state.error = payload;
        state.IsLoading = false;
      })
      .addCase(addComment.pending, (state, { payload }) => {
        state.IsLoading = true;
        state.error = "";
      })
      .addCase(addComment.fulfilled, (state, { payload }) => {
        state.IsLoading = false;
      })
      .addCase(addComment.rejected, (state, { payload }) => {
        state.error = payload;
        state.IsLoading = false;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.postsData = [];
        state.postsImages = [];
        state.postComents = [];
      });
  },
});

export const postsSliceReducer = postSlice.reducer;

export const { addPostsToRedux } = postSlice.actions;
