import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('lotka-volterra-equations',options,{config:LIFE_LABS['lotka-volterra-equations'],draw:drawLife});};
