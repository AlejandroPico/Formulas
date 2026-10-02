import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('mohr-circle-2d-stress-transformation',options,{config:SPECTRUM_LABS['mohr-circle-2d-stress-transformation'],draw:drawSpectrum});
