import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('logistic-regression-sigmoid-function',options,{config:CONTINUUM_LABS['logistic-regression-sigmoid-function'],draw:drawContinuum});
