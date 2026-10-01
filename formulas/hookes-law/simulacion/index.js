import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('hookes-law',options,{config:{...DISCOVERY_LABS['hookes-law'],animate:false},draw:drawDiscovery});
