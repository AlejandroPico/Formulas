import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('ac-ohms-law-impedance',options,{config:SPECTRUM_LABS['ac-ohms-law-impedance'],draw:drawSpectrum});
