import {mountLab} from '../../shared/learning-lab.js';
import {NETWORK_LABS} from '../../shared/network-configs.js';
import {drawNetwork} from '../../shared/network-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('ppo-clipped-objective',options,{config:NETWORK_LABS['ppo-clipped-objective'],draw:drawNetwork});};
