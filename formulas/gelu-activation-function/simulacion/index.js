import {mountLab} from '../../shared/learning-lab.js';
import {NETWORK_LABS} from '../../shared/network-configs.js';
import {drawNetwork} from '../../shared/network-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('gelu-activation-function',options,{config:NETWORK_LABS['gelu-activation-function'],draw:drawNetwork});};
