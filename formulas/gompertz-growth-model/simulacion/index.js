import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('gompertz-growth-model',options,{config:CONTINUUM_LABS['gompertz-growth-model'],draw:drawContinuum});
