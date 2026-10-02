import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('net-present-value-npv',options,{config:ECONOMY_LABS['net-present-value-npv'],draw:drawEconomy});};
