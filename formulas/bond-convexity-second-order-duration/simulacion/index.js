import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('bond-convexity-second-order-duration',options,{config:ECONOMY_LABS['bond-convexity-second-order-duration'],draw:drawEconomy});};
