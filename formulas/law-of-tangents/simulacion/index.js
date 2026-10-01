import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('law-of-tangents',options,{config:{...DISCOVERY_LABS['law-of-tangents'],animate:false},draw:drawDiscovery});
