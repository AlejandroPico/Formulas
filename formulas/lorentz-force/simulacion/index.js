import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('lorentz-force',options,{config:SPECTRUM_LABS['lorentz-force'],draw:drawSpectrum});
