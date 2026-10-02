import {mountLab} from '../../shared/learning-lab.js';
import {INSIGHT_LABS} from '../../shared/insight-configs.js';
import {drawInsight} from '../../shared/insight-draw.js';
export default options=>{options.root.classList.add('insight-lab');return mountLab('schwarzschild-metric-time-dilation',options,{config:INSIGHT_LABS['schwarzschild-metric-time-dilation'],draw:drawInsight});};
