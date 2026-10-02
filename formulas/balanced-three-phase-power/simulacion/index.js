import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('balanced-three-phase-power',options,{config:SPECTRUM_LABS['balanced-three-phase-power'],draw:drawSpectrum});
