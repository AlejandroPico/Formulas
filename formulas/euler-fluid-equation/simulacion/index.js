import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('euler-fluid-equation',options,{config:HORIZON_LABS['euler-fluid-equation'],draw:drawHorizon});
