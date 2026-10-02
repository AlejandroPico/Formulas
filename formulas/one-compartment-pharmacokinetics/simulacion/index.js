import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('one-compartment-pharmacokinetics',options,{config:LIFE_LABS['one-compartment-pharmacokinetics'],draw:drawLife});};
