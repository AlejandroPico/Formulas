import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('capacitor-stored-energy',options,{config:FRONTIER_LABS['capacitor-stored-energy'],draw:drawFrontier});
