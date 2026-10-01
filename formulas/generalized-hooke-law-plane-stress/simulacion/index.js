import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('generalized-hooke-law-plane-stress',options,{config:{...DISCOVERY_LABS['generalized-hooke-law-plane-stress'],animate:false},draw:drawDiscovery});
