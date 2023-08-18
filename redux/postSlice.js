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
        .addCase(writeDataToFirestore.pending, (state, {payload})=>{
            state.IsPostLoading = true
        }).addCase(writeDataToFirestore.rejected, (state, {payload})=> {
            state.error = payload
        }).addCase(getAllposts.pending, (state)=> {
            state.IsPostLoading = true
            state.error = ''
        })
        .addCase(getAllposts.fulfilled, (state, {payload}) => {
            state.postsData = payload
            state.IsPostLoading = false
        }).addCase(getAllposts.rejected, (state, {payload}) => {
            state.error = payload
            state.IsPostLoading = false
        }).addCase(getAllpostsImages.pending, (state)=> {
            state.IsPostLoading = true
            state.error = ''
        })
        .addCase(getAllpostsImages.fulfilled, (state, {payload})=> {
            state.postsImages = payload
            state.IsPostLoading = false
        }).addCase(getAllpostsImages.rejected, (state, {payload})=> {
            state.error = payload
            state.IsPostLoading = false
        })
    }
})
 
export const postsSliceReducer = postSlice.reducer