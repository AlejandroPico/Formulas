import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('series-rlc-resonance',options,{config:SPECTRUM_LABS['series-rlc-resonance'],draw:drawSpectrum});
