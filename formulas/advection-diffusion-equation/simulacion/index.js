import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('advection-diffusion-equation',options,{config:SPECTRUM_LABS['advection-diffusion-equation'],draw:drawSpectrum});
