import {mountLab} from '../../shared/learning-lab.js';
import {INSIGHT_LABS} from '../../shared/insight-configs.js';
import {drawInsight} from '../../shared/insight-draw.js';
export default options=>{options.root.classList.add('insight-lab');return mountLab('principal-component-analysis-pca',options,{config:INSIGHT_LABS['principal-component-analysis-pca'],draw:drawInsight});};
