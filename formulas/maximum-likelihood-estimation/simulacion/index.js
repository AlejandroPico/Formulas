import {mountLab} from '../../shared/learning-lab.js';
import {INFORMATION_LABS} from '../../shared/information-configs.js';
import {drawInformation} from '../../shared/information-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('maximum-likelihood-estimation',options,{config:INFORMATION_LABS['maximum-likelihood-estimation'],draw:drawInformation});};
