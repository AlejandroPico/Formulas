import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('hyperbolic-tangent-activation',options,{config:HORIZON_LABS['hyperbolic-tangent-activation'],draw:drawHorizon});
