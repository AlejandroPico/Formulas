import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('linear-momentum-conservation',options,{config:FRONTIER_LABS['linear-momentum-conservation'],draw:drawFrontier});
