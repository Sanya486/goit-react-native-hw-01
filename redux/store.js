import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAuthReducer } from "./authSlice";
import { postsSliceReducer } from "./postSlice";

const persistAuthConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const persistPostsConfig = {
  key: "posts",
  storage: AsyncStorage,
};

const authReducer = persistReducer(persistAuthConfig, userAuthReducer);
const postsReducer = persistReducer(persistPostsConfig, postsSliceReducer);



export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["firebase", "firestore"],
      },
    }),
});

export const persistor = persistStore(store);
