import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('wohler-sn-fatigue-curve',options,{config:SPECTRUM_LABS['wohler-sn-fatigue-curve'],draw:drawSpectrum});
