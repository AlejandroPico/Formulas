import {mountLab} from '../../shared/learning-lab.js';
import {QUANTUM_LABS} from '../../shared/quantum-configs.js';
import {drawQuantum} from '../../shared/quantum-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('heisenberg-uncertainty-principle',options,{config:QUANTUM_LABS['heisenberg-uncertainty-principle'],draw:drawQuantum});};
