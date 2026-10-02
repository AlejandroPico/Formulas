import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('dynamic-chemical-equilibrium',options,{config:SPECTRUM_LABS['dynamic-chemical-equilibrium'],draw:drawSpectrum});
