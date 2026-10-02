import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('lienard-wiechert-potentials',options,{config:SPECTRUM_LABS['lienard-wiechert-potentials'],draw:drawSpectrum});
