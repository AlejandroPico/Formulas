import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('central-limit-theorem',options,{config:HORIZON_LABS['central-limit-theorem'],draw:drawHorizon});
