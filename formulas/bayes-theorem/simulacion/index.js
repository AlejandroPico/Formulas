import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('bayes-theorem',options,{config:HORIZON_LABS['bayes-theorem'],draw:drawHorizon});
