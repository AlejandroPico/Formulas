import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('derivative-as-limit',options,{config:FRONTIER_LABS['derivative-as-limit'],draw:drawFrontier});
