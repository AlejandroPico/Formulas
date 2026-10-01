import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('continuity-equation',options,{config:FRONTIER_LABS['continuity-equation'],draw:drawFrontier});
