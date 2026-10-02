import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('clausius-clapeyron-equation',options,{config:SPECTRUM_LABS['clausius-clapeyron-equation'],draw:drawSpectrum});
