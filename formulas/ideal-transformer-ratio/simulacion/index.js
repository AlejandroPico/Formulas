import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('ideal-transformer-ratio',options,{config:CONTINUUM_LABS['ideal-transformer-ratio'],draw:drawContinuum});
