import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('shear-stress-cizalladura',options,{config:SPECTRUM_LABS['shear-stress-cizalladura'],draw:drawSpectrum});
