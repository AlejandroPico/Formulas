import {mountLab} from '../../shared/learning-lab.js';
import {COSMOS_LABS} from '../../shared/cosmos-configs.js';
import {drawCosmos} from '../../shared/cosmos-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('critical-density-parameter',options,{config:COSMOS_LABS['critical-density-parameter'],draw:drawCosmos});};
