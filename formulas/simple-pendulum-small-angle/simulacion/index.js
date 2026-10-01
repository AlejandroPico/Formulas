import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('simple-pendulum-small-angle',options,{config:{...DISCOVERY_LABS['simple-pendulum-small-angle'],animate:false},draw:drawDiscovery});
