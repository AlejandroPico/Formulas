import {mountLab} from '../../shared/learning-lab.js';
import {CONTINUUM_LABS} from '../../shared/continuum-configs.js';
import {drawContinuum} from '../../shared/continuum-draw.js';
export default options=>mountLab('normal-stress-axial-load',options,{config:CONTINUUM_LABS['normal-stress-axial-load'],draw:drawContinuum});
