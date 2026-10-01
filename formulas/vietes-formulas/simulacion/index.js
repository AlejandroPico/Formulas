import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('vietes-formulas',options,{config:{...DISCOVERY_LABS['vietes-formulas'],animate:false},draw:drawDiscovery});
