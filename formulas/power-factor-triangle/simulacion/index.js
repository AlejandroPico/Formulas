import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('power-factor-triangle',options,{config:SPECTRUM_LABS['power-factor-triangle'],draw:drawSpectrum});
