import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyACORliJ_-qfKDBWrWQl5YjDbNj5-j8CIo",
    authDomain: "bancodedadosbkkkk.firebaseapp.com",
    projectId: "bancodedadosbkkkk",
    storageBucket: "bancodedadosbkkkk.appspot.com",
    messagingSenderId: "980013103018",
    appId: "1:980013103018:web:d32847776d2c857f081dd3",
    measurementId: "G-3FFXZMGX2M"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth (firebaseApp);

export {db, auth};

