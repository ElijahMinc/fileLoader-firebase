export const Toast = (message, isOk) => {
   const body = document.querySelector('body')

   const toastHTML = document.createElement('div')
   const toastClasses = isOk ? 'ok' : 'error'
   toastHTML.classList.add('toast')
   toastHTML.classList.add(toastClasses)
   toastHTML.textContent = message

   body.append(toastHTML)

   setTimeout(() => {
      toastHTML.remove()
   }, 5000)
}