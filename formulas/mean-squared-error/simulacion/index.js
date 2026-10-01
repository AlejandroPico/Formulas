import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('mean-squared-error',options,{config:HORIZON_LABS['mean-squared-error'],draw:drawHorizon});
