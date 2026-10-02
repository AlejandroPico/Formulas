import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('adam-optimizer-adaptive-moment-estimation',options,{config:MACHINE_LABS['adam-optimizer-adaptive-moment-estimation'],draw:drawMachine});};
