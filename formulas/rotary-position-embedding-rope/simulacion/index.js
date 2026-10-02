import {mountLab} from '../../shared/learning-lab.js';
import {NETWORK_LABS} from '../../shared/network-configs.js';
import {drawNetwork} from '../../shared/network-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('rotary-position-embedding-rope',options,{config:NETWORK_LABS['rotary-position-embedding-rope'],draw:drawNetwork});};
