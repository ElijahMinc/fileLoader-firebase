
import '@fortawesome/fontawesome-free/css/all.min.css';

function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (!bytes) return '0 Byte';
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const addEventListener = (currentElement, event, callback) => {
   if(!currentElement) return

   return currentElement.addEventListener(event, callback)
}

const createElement = (element, textContent, classes) => {
   const elementHTML = document.createElement(element)

   if(!!classes.length)
   {
      elementHTML.classList.add(...classes)
   }
   if(!!textContent)
   {
      elementHTML.textContent = textContent
   }

   return elementHTML
}

const arrayOfDefaultClassesOpenFileBtn = ['btnFile','btnOpenFile']
const arrayOfDefaultClassesLoadFileBtn = ['btnFile','btnLoadFile']
const arrayOfDefaultClassesOpenFileField = ['fieldFile','fieldOpenFile']
const arrayOfDefaultClassesLoadFileField = ['fieldFile','fieldLoadFile']
const arrayOfDefaultClassesPreviewContainer = ['preview']


const defaultOptions = {
   multiple: true,
   formats: ['jpg', 'jpeg', 'webp'],
   sizeMb: 1,
   onUpload(){},
   handleError(error){}
}

class FileLoader {
   constructor(selector, options){
      this.files = []
      this.invalid = false
      this.$openFileBtn = options?.typeFile === 'field' ? createElement('div', !!options?.multiple ? 'Select files' : 'Select file', arrayOfDefaultClassesOpenFileField) : createElement('div', 'Open', arrayOfDefaultClassesOpenFileBtn)
      this.$loadFileBtn = options?.typeFile === 'field' ? createElement('button', 'Load', arrayOfDefaultClassesLoadFileField) : createElement('button', 'Load', arrayOfDefaultClassesLoadFileBtn)
      this.$previewContainer = createElement('div', '', arrayOfDefaultClassesPreviewContainer)
      this._rootSelector = document.querySelector(selector)
      this.options = !!Object.keys(options).length ? options : defaultOptions

      this.#render()
      this.#setup()
   }

   #handleSize(sizeMb){
      return +sizeMb * 1024 * 1024
   }

   #triggerInputElement () {
      if(this.$openFileBtn.classList.contains('disabled')) return
      this._rootSelector.click()
   }

   #removeItemPreview(event){
     if(!event.target.dataset) return

     const { name } = event.target.dataset

     this.files = this.files.filter(file => file.name !== name)
      
      if(!this.files.length){
         this.$loadFileBtn.style.display = 'none'
      }

      const currentPreviewElement = document.querySelector(`[data-name='${name}']`)?.closest('.preview__item')

      if(!currentPreviewElement){
         return
      }
      currentPreviewElement.classList.add('remove')

      setTimeout(() => currentPreviewElement.remove(), 300)      
   }

   #filterImgsFormats(selectFormats = []){
      let updateFiles = []

      for (let indexFormat = 0; indexFormat < selectFormats.length; indexFormat++) {
         const format = selectFormats[indexFormat];

         for (let indexFile = 0; indexFile < this.files.length; indexFile++) {
            const file = this.files[indexFile];

            if (`image/${format}`.includes(file.type)){
               updateFiles.push(file)

               continue
            }
         }
      }
      this.files = [...updateFiles]
   }
   
   #filterImgsSizes(selectedSize){
      const currentSizeMb = this.#handleSize(selectedSize)
      let updateFilesLessCurrentSize = []
      let filesNameMoreCurrentSize = []
      for (let indexFile = 0; indexFile < this.files.length; indexFile++) {
         const file = this.files[indexFile];

         if (file.size < currentSizeMb){
            updateFilesLessCurrentSize.push(file)
         }else {
            filesNameMoreCurrentSize.push(file.name)
         }
      }

      if(!!filesNameMoreCurrentSize.length){
         this.#handleError(filesNameMoreCurrentSize)
      }

      this.files = [...updateFilesLessCurrentSize]
   }
   
   #handleLoadFiles() {
      if(!this.options?.onUpload) return
      const previewItems = document.querySelectorAll('.preview__item')
      const previewProgress = document.querySelectorAll('.preview__progress')

      this.$loadFileBtn.style.display = 'none'


      previewItems.forEach(previewItem => {
         const previewRemove = previewItem.querySelector('.preview__remove');
         previewRemove.remove()
      })
      this.files.forEach((file, index) => {

         const currentPreviewProgress = previewProgress[index]
         this.$openFileBtn.classList.add('disabled')
         this.$loadFileBtn.classList.add('disabled')

         const allBtns = {
            openBtn: this.$openFileBtn,
            loadBtn: this.$loadFileBtn
         }
         this.options?.onUpload?.(file, currentPreviewProgress, allBtns)
      })
   }

   #onChange (event){
      this.$previewContainer.innerHTML = ''

      const filesFileLoader = event.target.files

      
      this.files = [...filesFileLoader]

      if (!!this.options?.formats?.length){
         const selectFormats = this.options.formats
         this.#filterImgsFormats(selectFormats)
      }

      if (!!this.options?.sizeMb){
         this.#filterImgsSizes(this.options?.sizeMb)
      }

      if (!!this.files.length){
         this.$loadFileBtn.style.display = 'inline'
      }

      this.files.forEach(file => {
         if(!file.type.match('image')) return

         const reader = new FileReader()

         const {name, size} = file

         reader.onload = (env) => {
            const src = env.currentTarget.result
         this.$previewContainer.insertAdjacentHTML('beforeend', `
            <div class="preview__item">
               <div class="preview__remove">
                  <i class="fa-solid fa-xmark icon-close" data-name='${name}'></i>
               </div>
                  <img class="preview__img" src="${src}"/>
                  <div class="preview__data-info">
                     ${name}
                     ${bytesToSize(size)}
                  </div>
               <div class="preview__progress loading"></div>
            </div>
            `)
         }
         reader.readAsDataURL(file)
      })
      
   }

   #setup(){
      if(!!this.options?.multiple){
         this._rootSelector.setAttribute('multiple', true)
      }

      if(!!this.options?.formats?.length){
         this._rootSelector.setAttribute('accept', this.options.formats.map(format => `.${format}`).join(','))
      }
      
      addEventListener(this.$openFileBtn, 'click', this.#triggerInputElement.bind(this))
      addEventListener(this.$previewContainer, 'click', this.#removeItemPreview.bind(this))
      addEventListener(this.$loadFileBtn, 'click', this.#handleLoadFiles.bind(this))
      addEventListener(this._rootSelector, 'change', this.#onChange.bind(this))
   }

   #render() {
      this._rootSelector.insertAdjacentElement('afterend', this.$previewContainer)
      this._rootSelector.insertAdjacentElement('afterend', this.$loadFileBtn)
      this._rootSelector.insertAdjacentElement('afterend', this.$openFileBtn)
   }

   #handleError(filesNameMoreCurrentSize = []){
     const invalidFileWithSize = filesNameMoreCurrentSize;
     const error = {
        invalidSize: invalidFileWithSize
     }

     this.options.handleError(error)
   }
}


export default FileLoader