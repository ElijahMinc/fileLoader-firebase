import { getStorage  } from "firebase/storage";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
   apiKey: "AIzaSyAgBj6wfzAPDMKHsTcrg4MYDtyPLrhQ0TU",
   authDomain: "fileloader-42e2f.firebaseapp.com",
   projectId: "fileloader-42e2f",
   storageBucket: "fileloader-42e2f.appspot.com",
   messagingSenderId: "740330206763",
   appId: "1:740330206763:web:8e6cbf5269db288963dc6e"
};
 
initializeApp(firebaseConfig);


export const storage = getStorage();