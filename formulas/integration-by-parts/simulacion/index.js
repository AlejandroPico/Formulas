import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('integration-by-parts',options,{config:FRONTIER_LABS['integration-by-parts'],draw:drawFrontier});
