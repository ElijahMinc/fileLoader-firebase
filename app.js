import FileLoader from "./src/fileloader";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import './src/assets/styles/style.css'


const firebaseConfig = {
  apiKey: "AIzaSyAgBj6wfzAPDMKHsTcrg4MYDtyPLrhQ0TU",
  authDomain: "fileloader-42e2f.firebaseapp.com",
  projectId: "fileloader-42e2f",
  storageBucket: "fileloader-42e2f.appspot.com",
  messagingSenderId: "740330206763",
  appId: "1:740330206763:web:8e6cbf5269db288963dc6e"
};

initializeApp(firebaseConfig);

const storage = getStorage();

const file1 = new FileLoader('.file',{
   typeFile: 'field', // or button
   multiple: true,
   formats: ['jpg', 'jpeg', 'webp'],
   sizeMb: 2,
   onUpload(file, currentPreviewProgress, allBtns){
      const storageRef = ref(storage, `image/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // previewProgress
          console.log('Upload is ' + progress + '% done');
          currentPreviewProgress.style.width = `${progress}%`
          currentPreviewProgress.textContent = progress.toFixed(0) + '%'
          if(progress === 100){
            currentPreviewProgress.style.backgroundSize = 'auto'
          }
        },
        (error) => {
          console.log(`Error: ${error}`)
        },
        () => {
          Object.entries(allBtns).forEach(([key, _]) => allBtns[key].classList.remove('disabled'))
        }
        )
   },
   handleError(error){
     console.log(error)
   }
})