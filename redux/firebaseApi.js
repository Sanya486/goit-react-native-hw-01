import { useSelector } from "react-redux";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../config';
import {  ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config";



export const registerDB = createAsyncThunk("/signUp", async ({ email, password }, thunk) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response.user.uid;
  } catch (error) {
 return thunk.rejectWithValue(error.customData._tokenResponse.error.message);
  }
});


export const loginDB = createAsyncThunk("/signIn", async ({ email, password }, thunk) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    console.log(credentials)
    return credentials.user.uid;
  } catch (error) {
    return thunk.rejectWithValue(error.customData._tokenResponse.error.message);
  }
});

export const updateUserProfile = async (update) => {
  const user = auth.currentUser;

  // якщо такий користувач знайдений
  if (user) {
    // оновлюємо його профайл
    try {
      await updateProfile(user, update);
    } catch (error) {
      throw error;
    }
  }
};

export const logOut = createAsyncThunk("/logout", async (_, thunk) => {
  try {
    const response = await signOut(auth);
    console.log(response)
    return response
  } catch (error) {
    return thunk.rejectWithValue(error.customData._tokenResponse.error.message);
  }
});


// =================== FireStore ===================

export const writeDataToFirestore = createAsyncThunk('/creatPost', async ({uid,  nameInput, locationInput, photoFile, location}, thunk) => {
  try {
    const docRef = await addDoc(collection(db, `users/${uid}/posts`), {
      nameInput,
      locationInput,
      location
    });
    console.log(docRef);
    const storageRef = ref(storage, `users/${uid}/postImages/${docRef.id}`)
    await uploadBytes(storageRef, photoFile)
  
  } catch (e) {
    return thunk.rejectWithValue(e.customData._tokenResponse.error.message);
  }
});

export const getAllposts = createAsyncThunk('getAllPosts', async (uid, thunk) => {
  try {
    let posts = []
    const query = await getDocs(collection(db, 'users', uid, 'posts'))
    query.forEach(doc => {
      const id = doc.id
      const data = doc.data()
      const postData = {...data, id}
      posts.push(postData)})
    // const listRef = ref(storage, `users/${uid}/postImages`)
    // const images = await listAll(listRef)
    // images.items.forEach(async (item)  => {
    //  const url = await getDownloadURL(item)
    
    // })
    // const cumulativeArr = posts.map((post, index) => {
    //   return {...post, photo: imagesArr[0]}
    // })
    console.log(posts)
    return posts
  } catch (error) {
    return thunk.rejectWithValue(e.customData._tokenResponse.error.message);
  }
})

export const getAllpostsImages = createAsyncThunk('getAllPostsImages', async (uid, thunk) => {
  try {
    let imagesArr = []
    const listRef = ref(storage, `users/${uid}/postImages`)
    const images = await listAll(listRef)
    images.items.forEach( (item)  => {
      console.log(item)
      const id  = item.name
      const url =  getDownloadURL(item)
      const imageData = {
        imagePromise: url,
        id
      }
     imagesArr.push(imageData)
    })
   const arr =  await Promise.all(imagesArr.map(image=> image.imagePromise))
  //  const imagesUrl = arr.map((item, index)=> {
  //   const id = imagesArr[index].id
  //   return {
  //     item,
  //     id
  //   }
  //  })
  const imagesUrl = {}
  arr.forEach((item, index)=> {
    const id = imagesArr[index].id
    imagesUrl[id] = item
  })
   console.log(imagesUrl)
    return imagesUrl
  } catch (error) {
    return thunk.rejectWithValue(e.customData._tokenResponse.error.message);
  }
})

