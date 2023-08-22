export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUid = (state) => state.auth.data?.uid
export const selectDisplayName = (state) => state.auth.data?.displayName
export const selectEmail = (state) => state.auth.data?.email
export const selectUserData = (state) => state.auth.data
export const selectPostsData = (state) => state.posts.postsData
export const selectPostImages = (state)=> state.posts.postsImages
export const selectUserPhoto = (state) => state.auth.userPhoto