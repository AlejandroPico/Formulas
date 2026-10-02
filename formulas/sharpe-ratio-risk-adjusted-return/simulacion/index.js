import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('sharpe-ratio-risk-adjusted-return',options,{config:ECONOMY_LABS['sharpe-ratio-risk-adjusted-return'],draw:drawEconomy});};
