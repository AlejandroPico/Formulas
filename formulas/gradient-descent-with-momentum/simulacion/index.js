import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('gradient-descent-with-momentum',options,{config:MACHINE_LABS['gradient-descent-with-momentum'],draw:drawMachine});};
