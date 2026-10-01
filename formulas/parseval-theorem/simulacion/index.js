import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('parseval-theorem',options,{config:HORIZON_LABS['parseval-theorem'],draw:drawHorizon});
