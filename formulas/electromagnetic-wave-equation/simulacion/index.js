import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('electromagnetic-wave-equation',options,{config:SPECTRUM_LABS['electromagnetic-wave-equation'],draw:drawSpectrum});
