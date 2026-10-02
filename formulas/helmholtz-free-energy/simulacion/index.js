import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('helmholtz-free-energy',options,{config:SPECTRUM_LABS['helmholtz-free-energy'],draw:drawSpectrum});
