import {mountLab} from '../../shared/learning-lab.js';
import {COSMOS_LABS} from '../../shared/cosmos-configs.js';
import {drawCosmos} from '../../shared/cosmos-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('cosmological-equation-of-state',options,{config:COSMOS_LABS['cosmological-equation-of-state'],draw:drawCosmos});};
