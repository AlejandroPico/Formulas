import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('poisson-equation',options,{config:HORIZON_LABS['poisson-equation'],draw:drawHorizon});
