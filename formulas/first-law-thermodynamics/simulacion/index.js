import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('first-law-thermodynamics',options,{config:SPECTRUM_LABS['first-law-thermodynamics'],draw:drawSpectrum});
