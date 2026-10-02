import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('fisher-kpp-diffusion-equation',options,{config:LIFE_LABS['fisher-kpp-diffusion-equation'],draw:drawLife});};
