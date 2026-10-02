import {mountLab} from '../../shared/learning-lab.js';
import {SPECTRUM_LABS} from '../../shared/spectrum-configs.js';
import {drawSpectrum} from '../../shared/spectrum-draw.js';
export default options=>mountLab('price-elasticity-of-demand',options,{config:SPECTRUM_LABS['price-elasticity-of-demand'],draw:drawSpectrum});
