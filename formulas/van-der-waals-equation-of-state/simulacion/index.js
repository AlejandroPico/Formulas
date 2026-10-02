import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('van-der-waals-equation-of-state',options,{config:SPECTRUM_LABS['van-der-waals-equation-of-state'],draw:drawSpectrum});
