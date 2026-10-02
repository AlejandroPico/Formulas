import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('ideal-gas-law',options,{config:CONTINUUM_LABS['ideal-gas-law'],draw:drawContinuum});
