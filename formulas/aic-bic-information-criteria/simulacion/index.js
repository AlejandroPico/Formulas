import {mountLab} from '../../shared/learning-lab.js';
import {INFORMATION_LABS} from '../../shared/information-configs.js';
import {drawInformation} from '../../shared/information-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('aic-bic-information-criteria',options,{config:INFORMATION_LABS['aic-bic-information-criteria'],draw:drawInformation});};
