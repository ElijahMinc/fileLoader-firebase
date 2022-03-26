import 'regenerator-runtime/runtime'
import { ref, uploadBytesResumable, listAll, getDownloadURL, deleteObject  } from "firebase/storage";

import {storage} from './storage/storage'
import FileLoader from "./src/fileloader";
import {Loader} from './src/components/Loader'
import {Toast} from './src/components/Toast'
import './src/assets/styles/style.css'


const loading = document.querySelector('#loading')


const asyncFetchFilesFromStorage = async () => {
  
  loading.innerHTML = Loader()
  
  const filesBlock = document.querySelector('.files-block')

  filesBlock.innerHTML = ''

  const listRef = ref(storage, 'image')

  try {
    const list = await listAll(listRef)

     const promiseItemsRef =  list.items.map(async (itemRef) => {

        const path = itemRef._location.path
        const storageRef = ref(storage, path)

        return await getDownloadURL(storageRef)

      })

      Promise.all(promiseItemsRef).then((result) => {
        loading.innerHTML = ''

        if(!result.length){
          return Toast('Storage is empty', false)
        } 
         console.log(result)

        result.forEach(src => (
          filesBlock.insertAdjacentHTML('beforeend', `
          <div class="files-block__item" data-src='${src}' >
            <img src="${src}" alt="${src}">
          </div>
        `)
        )) 
        Toast('All images loaded', true)

      })

  } catch (error) {
      console.log(error)
  }
}


if(!!files){
  files.addEventListener('click', asyncFetchFilesFromStorage)
}



const filesBlock = document.querySelector('.files-block');

filesBlock.addEventListener('click',async (event) => {
  if(!event.target.dataset) return
  console.log(event)
  const { src } = event.target.dataset
  const desertRef = ref(storage, src);
  await deleteObject(desertRef)

  filesBlock.innerHTML = ''
  loading.innerHTML = Loader()
  
  console.log('deleted succesfull')

  Toast('Deleted succesfull', true)

  await asyncFetchFilesFromStorage()

  loading.innerHTML = ''


})
       


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