import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('maxwell-boltzmann-speed-distribution',options,{config:SPECTRUM_LABS['maxwell-boltzmann-speed-distribution'],draw:drawSpectrum});
