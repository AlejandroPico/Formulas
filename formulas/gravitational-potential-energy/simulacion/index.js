import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('gravitational-potential-energy',options,{config:FRONTIER_LABS['gravitational-potential-energy'],draw:drawFrontier});
