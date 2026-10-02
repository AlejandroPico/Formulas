import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('singular-value-decomposition-svd',options,{config:SPECTRUM_LABS['singular-value-decomposition-svd'],draw:drawSpectrum});
