import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('maximum-margin-support-vector-machine',options,{config:MACHINE_LABS['maximum-margin-support-vector-machine'],draw:drawMachine});};
