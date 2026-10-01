import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('law-of-sines',options,{config:{...DISCOVERY_LABS['law-of-sines'],animate:false},draw:drawDiscovery});
