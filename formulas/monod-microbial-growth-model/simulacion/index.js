import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('monod-microbial-growth-model',options,{config:LIFE_LABS['monod-microbial-growth-model'],draw:drawLife});};
