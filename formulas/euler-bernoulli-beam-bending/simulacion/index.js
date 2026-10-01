import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('euler-bernoulli-beam-bending',options,{config:FRONTIER_LABS['euler-bernoulli-beam-bending'],draw:drawFrontier});
