import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('voltage-gain-decibels',options,{config:LIFE_LABS['voltage-gain-decibels'],draw:drawLife});};
