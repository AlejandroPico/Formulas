import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('bernoulli-equation',options,{config:FRONTIER_LABS['bernoulli-equation'],draw:drawFrontier});
