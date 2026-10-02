import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('electric-gauss-law',options,{config:CONTINUUM_LABS['electric-gauss-law'],draw:drawContinuum});
