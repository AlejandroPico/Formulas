import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('least-squares-regression',options,{config:HORIZON_LABS['least-squares-regression'],draw:drawHorizon});
