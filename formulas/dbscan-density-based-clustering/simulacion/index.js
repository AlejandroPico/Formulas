import {mountLab} from '../../shared/learning-lab.js';
import {MACHINE_LABS} from '../../shared/machine-configs.js';
import {drawMachine} from '../../shared/machine-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('dbscan-density-based-clustering',options,{config:MACHINE_LABS['dbscan-density-based-clustering'],draw:drawMachine});};
