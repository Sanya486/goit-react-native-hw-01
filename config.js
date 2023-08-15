// Для роботи із firebase обовʼязково треба ініціалізувати проект
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD6a0nMZfRLGu9ObiZxMMXgjaWDcEH6Ok",
  authDomain: "my-react-native-395721.firebaseapp.com",
  projectId: "my-react-native-395721",
  storageBucket: "my-react-native-395721.appspot.com",
  messagingSenderId: "865581296516",
  appId: "1:865581296516:web:62e9a8dfdfb0b7cfafcbd1",
  measurementId: "G-8DKVF6H5S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)

