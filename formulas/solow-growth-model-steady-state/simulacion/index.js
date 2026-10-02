import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('solow-growth-model-steady-state',options,{config:ECONOMY_LABS['solow-growth-model-steady-state'],draw:drawEconomy});};
