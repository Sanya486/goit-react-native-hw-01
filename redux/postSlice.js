import { createSlice } from "@reduxjs/toolkit";
import { getAllposts, getAllpostsImages, uploadPhototoFirestore, writeDataToFirestore } from "./firebaseApi";

 const postSlice = createSlice({
    name: 'possts',
    initialState: {
        postsData: [],
        postsImages: [],
        IsPostLoading: 'false',
        error: '',
    },
    extraReducers: (builder) => {
        builder
        .addCase(writeDataToFirestore.fulfilled, (state, {payload})=>{
            // state.posts = payload.data
        }).addCase(getAllposts.fulfilled, (state, {payload}) => {
            state.postsData = payload
        }).addCase(getAllposts.rejected, (state, {payload}) => {
            state.error = payload
        }).addCase(getAllpostsImages.fulfilled, (state, {payload})=> {
            state.postsImages = payload
        })
    }
})
 
export const postsSliceReducer = postSlice.reducer