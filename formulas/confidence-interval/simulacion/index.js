import {mountLab} from '../../shared/learning-lab.js';
import {INFORMATION_LABS} from '../../shared/information-configs.js';
import {drawInformation} from '../../shared/information-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('confidence-interval',options,{config:INFORMATION_LABS['confidence-interval'],draw:drawInformation});};
