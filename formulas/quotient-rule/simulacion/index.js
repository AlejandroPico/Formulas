import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('quotient-rule',options,{config:{...DISCOVERY_LABS['quotient-rule'],animate:false},draw:drawDiscovery});
