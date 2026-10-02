import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('gibbs-free-energy-spontaneity',options,{config:SPECTRUM_LABS['gibbs-free-energy-spontaneity'],draw:drawSpectrum});
