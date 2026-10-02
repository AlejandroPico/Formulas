import {mountLab} from '../../shared/learning-lab.js';
import {INSIGHT_LABS} from '../../shared/insight-configs.js';
import {drawInsight} from '../../shared/insight-draw.js';
export default options=>{options.root.classList.add('insight-lab');return mountLab('canonical-ensemble-partition-function',options,{config:INSIGHT_LABS['canonical-ensemble-partition-function'],draw:drawInsight});};
