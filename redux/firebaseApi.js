import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config"



export const registerDB = createAsyncThunk(
  "/signUp",
  async ({ email, password, login, photoFile }, thunk) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if(photoFile){
        const storageRef = ref(storage, `users/${response.user.uid}/userPhoto`);
        await uploadBytes(storageRef, photoFile);
      }
       await updateProfile(auth.currentUser, {displayName: login})
      
      return {
        displayName: auth.currentUser.displayName,
        email: response.user.email,
        uid: response.user.uid,
      };
    } catch (error) {
      console.log(error)
      return thunk.rejectWithValue(error.message);
    }
  }
);

export const loginDB = createAsyncThunk(
  "/signIn",
  async ({ email, password }, thunk) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return {
        displayName: response.user.displayName,
        email: response.user.email,
        uid: response.user.uid,
      };
    } catch (error) {
      return thunk.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk("/logout", async (_, thunk) => {
  try {
    const response = await signOut(auth);

    return response;
  } catch (error) {
    return thunk.rejectWithValue(error.message);
  }
});

export const getUserPhoto = createAsyncThunk('/getUserPhoto',async (uid, thunk)=> {
  try {
    const imageRel = ref(storage, `users/${uid}/userPhoto`);
    return await getDownloadURL(imageRel);
  } catch (error) {
    thunk.rejectWithValue(error.code)
  }
})

// =================== FireStore ===================

export const writeDataToFirestore = createAsyncThunk(
  "/creatPost",
  async (
    { uid, nameInput, locationInput, photoFile, location, timeNow },
    thunk
  ) => {
    try {
      const docRef = await addDoc(collection(db, `users/${uid}/posts/`), {
        nameInput,
        locationInput,
        location,
        timeNow,
      });  
      const storageRef = ref(storage, `users/${uid}/postImages/${docRef.id}`);
      await uploadBytes(storageRef, photoFile);
    } catch (error) {
      return thunk.rejectWithValue(error.message);
    }
  }
);

export const getAllposts = createAsyncThunk(
  "getAllPosts",
  async (uid, thunk) => {
    try {
      let posts = [];
      const query = await getDocs(collection(db, "users", uid, "posts",));
    
      query.forEach((doc) => {
        
        const id = doc.id;
        const data = doc.data();
        const postData = { ...data, id };
    
        posts.push(postData);
      });
      posts.sort((a, b) => b.timeNow - a.timeNow);
      return posts;
    } catch (error) {
      return thunk.rejectWithValue(error.message);
    }
  }
);

export const getAllpostsImages = createAsyncThunk(
  "getAllPostsImages",
  async (uid, thunk) => {
    try {
      let imagesArr = [];
      const listRef = ref(storage, `users/${uid}/postImages`);
      const images = await listAll(listRef);
      images.items.forEach((item) => {
        const id = item.name;
        const url = getDownloadURL(item);
        const imageData = {
          imagePromise: url,
          id,
        };
        imagesArr.push(imageData);
      });
      const arr = await Promise.all(
        imagesArr.map((image) => image.imagePromise)
      );

      const imagesUrl = {};
      arr.forEach((item, index) => {
        const id = imagesArr[index].id;
        imagesUrl[id] = item;
      });
      return imagesUrl;
    } catch (error) {
      return thunk.rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "/addComment",
  async ({ input, id, uid, timeNow }, thunk) => {
    try {
      const docRef = await addDoc(collection(db, `users/${uid}/posts/${id}/comments`, ),
        { input, timeNow}
      );
    } catch (error) {
      return thunk.rejectWithValue(error.message);
    }
  }
);
