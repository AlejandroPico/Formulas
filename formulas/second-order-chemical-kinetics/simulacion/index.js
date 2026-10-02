import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('second-order-chemical-kinetics',options,{config:CONTINUUM_LABS['second-order-chemical-kinetics'],draw:drawContinuum});
