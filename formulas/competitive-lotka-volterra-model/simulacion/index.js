import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('competitive-lotka-volterra-model',options,{config:LIFE_LABS['competitive-lotka-volterra-model'],draw:drawLife});};
