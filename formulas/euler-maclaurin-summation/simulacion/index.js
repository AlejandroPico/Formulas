import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('euler-maclaurin-summation',options,{config:FRONTIER_LABS['euler-maclaurin-summation'],draw:drawFrontier});
