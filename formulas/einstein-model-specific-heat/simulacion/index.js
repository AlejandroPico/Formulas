import {mountLab} from '../../shared/learning-lab.js';
import {INSIGHT_LABS} from '../../shared/insight-configs.js';
import {drawInsight} from '../../shared/insight-draw.js';
export default options=>{options.root.classList.add('insight-lab');return mountLab('einstein-model-specific-heat',options,{config:INSIGHT_LABS['einstein-model-specific-heat'],draw:drawInsight});};
