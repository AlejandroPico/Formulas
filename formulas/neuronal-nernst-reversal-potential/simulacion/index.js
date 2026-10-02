import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('neuronal-nernst-reversal-potential',options,{config:SPECTRUM_LABS['neuronal-nernst-reversal-potential'],draw:drawSpectrum});
