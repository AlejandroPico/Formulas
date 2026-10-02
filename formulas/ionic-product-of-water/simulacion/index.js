import {mountLab} from '../../shared/learning-lab.js';
import {INSIGHT_LABS} from '../../shared/insight-configs.js';
import {drawInsight} from '../../shared/insight-draw.js';
export default options=>{options.root.classList.add('insight-lab');return mountLab('ionic-product-of-water',options,{config:INSIGHT_LABS['ionic-product-of-water'],draw:drawInsight});};
