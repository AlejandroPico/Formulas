import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('cramers-rule',options,{config:HORIZON_LABS['cramers-rule'],draw:drawHorizon});
