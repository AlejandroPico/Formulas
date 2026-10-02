import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('kelly-criterion-money-management',options,{config:ECONOMY_LABS['kelly-criterion-money-management'],draw:drawEconomy});};
