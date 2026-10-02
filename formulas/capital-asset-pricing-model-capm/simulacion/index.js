import {mountLab} from '../../shared/learning-lab.js';
import {ECONOMY_LABS} from '../../shared/economy-configs.js';
import {drawEconomy} from '../../shared/economy-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('capital-asset-pricing-model-capm',options,{config:ECONOMY_LABS['capital-asset-pricing-model-capm'],draw:drawEconomy});};
