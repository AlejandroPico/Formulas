import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('z-hypothesis-test',options,{config:SPECTRUM_LABS['z-hypothesis-test'],draw:drawSpectrum});
