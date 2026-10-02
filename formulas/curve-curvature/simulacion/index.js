import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('curve-curvature',options,{config:CONTINUUM_LABS['curve-curvature'],draw:drawContinuum});
