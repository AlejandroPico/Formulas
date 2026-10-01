import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('binomial-theorem',options,{config:{...DISCOVERY_LABS['binomial-theorem'],animate:false},draw:drawDiscovery});
