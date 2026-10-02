import {mountLab} from '../../shared/learning-lab.js';
import {NETWORK_LABS} from '../../shared/network-configs.js';
import {drawNetwork} from '../../shared/network-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('scaled-dot-product-attention',options,{config:NETWORK_LABS['scaled-dot-product-attention'],draw:drawNetwork});};
