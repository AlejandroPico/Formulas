import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('incompressible-navier-stokes-equation',options,{config:HORIZON_LABS['incompressible-navier-stokes-equation'],draw:drawHorizon});
