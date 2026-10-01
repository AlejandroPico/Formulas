import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('continuity-equation-fluid',options,{config:HORIZON_LABS['continuity-equation-fluid'],draw:drawHorizon});
