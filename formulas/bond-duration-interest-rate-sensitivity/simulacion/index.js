import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('bond-duration-interest-rate-sensitivity',options,{config:ECONOMY_LABS['bond-duration-interest-rate-sensitivity'],draw:drawEconomy});};
