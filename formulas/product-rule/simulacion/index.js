import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('product-rule',options,{config:{...DISCOVERY_LABS['product-rule'],animate:false},draw:drawDiscovery});
