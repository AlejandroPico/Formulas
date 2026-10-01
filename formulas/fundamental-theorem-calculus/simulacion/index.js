import {mountLab} from '../../shared/learning-lab.js';
import {DISCOVERY_LABS} from '../../shared/discovery-configs.js';
import {drawDiscovery} from '../../shared/discovery-draw.js';
export default options=>mountLab('fundamental-theorem-calculus',options,{config:{...DISCOVERY_LABS['fundamental-theorem-calculus'],animate:false},draw:drawDiscovery});
