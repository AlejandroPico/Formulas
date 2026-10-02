import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('manning-open-channel-flow',options,{config:SPECTRUM_LABS['manning-open-channel-flow'],draw:drawSpectrum});
