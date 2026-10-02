import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('linear-supply-demand-equilibrium',options,{config:SPECTRUM_LABS['linear-supply-demand-equilibrium'],draw:drawSpectrum});
