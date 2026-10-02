import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('geodesic-equation',options,{config:SPECTRUM_LABS['geodesic-equation'],draw:drawSpectrum});
