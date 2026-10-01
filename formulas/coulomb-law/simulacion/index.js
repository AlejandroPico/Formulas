import {mountLab} from '../../shared/learning-lab.js';
import {HORIZON_LABS} from '../../shared/horizon-configs.js';
import {drawHorizon} from '../../shared/horizon-draw.js';
export default options=>mountLab('coulomb-law',options,{config:HORIZON_LABS['coulomb-law'],draw:drawHorizon});
