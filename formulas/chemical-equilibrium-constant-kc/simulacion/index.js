import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('chemical-equilibrium-constant-kc',options,{config:SPECTRUM_LABS['chemical-equilibrium-constant-kc'],draw:drawSpectrum});
