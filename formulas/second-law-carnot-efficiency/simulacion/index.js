import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('second-law-carnot-efficiency',options,{config:CONTINUUM_LABS['second-law-carnot-efficiency'],draw:drawContinuum});
