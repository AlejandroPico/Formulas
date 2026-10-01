import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('one-dimensional-wave-equation',options,{config:FRONTIER_LABS['one-dimensional-wave-equation'],draw:drawFrontier});
