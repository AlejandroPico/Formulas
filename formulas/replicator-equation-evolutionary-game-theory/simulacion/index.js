import {mountLab} from '../../shared/learning-lab.js';
import {LIFE_LABS} from '../../shared/life-configs.js';
import {drawLife} from '../../shared/life-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('replicator-equation-evolutionary-game-theory',options,{config:LIFE_LABS['replicator-equation-evolutionary-game-theory'],draw:drawLife});};
