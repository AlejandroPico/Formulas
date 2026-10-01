import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('newton-second-law',options,{config:FRONTIER_LABS['newton-second-law'],draw:drawFrontier});
