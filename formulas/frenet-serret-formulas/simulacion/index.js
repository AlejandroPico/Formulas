import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('frenet-serret-formulas',options,{config:SPECTRUM_LABS['frenet-serret-formulas'],draw:drawSpectrum});
