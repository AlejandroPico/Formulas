import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('linear-transport-advection-equation',options,{config:HORIZON_LABS['linear-transport-advection-equation'],draw:drawHorizon});
