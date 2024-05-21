// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZefNLFWJMOBAFFdLqJvxVko5edonJnCE",
  authDomain: "app-personas-377b2.firebaseapp.com",
  projectId: "app-personas-377b2",
  storageBucket: "app-personas-377b2.appspot.com",
  messagingSenderId: "755920243794",
  appId: "1:755920243794:web:14b92525eea3511c4ca38b",
};

//INSTANCIA PRINCIPAL
const app = initializeApp(firebaseConfig);
//PARA EL LOGIN
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
//BASE DE DATOS
const db = getFirestore(app);
//SUBIR IMAGENES
const storage = getStorage(app);
export {
  auth,
  provider,
  db,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
  getDocs,
  collection,
  query,
  where,
};
