import svgLoader from '../assets/img/loader.svg';

export const Loader = () => {
   return `
      <div class="loader-mask">
         <img src="${svgLoader}"/>
      </div>
   `
}