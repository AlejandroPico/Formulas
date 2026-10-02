import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('q-learning-off-policy-td-control',options,{config:MACHINE_LABS['q-learning-off-policy-td-control'],draw:drawMachine});};
