import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('fourier-heat-conduction-1d-steady',options,{config:HORIZON_LABS['fourier-heat-conduction-1d-steady'],draw:drawHorizon});
