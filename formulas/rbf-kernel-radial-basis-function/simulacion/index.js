import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('rbf-kernel-radial-basis-function',options,{config:MACHINE_LABS['rbf-kernel-radial-basis-function'],draw:drawMachine});};
