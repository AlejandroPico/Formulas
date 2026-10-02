import {mountLab} from '../../shared/learning-lab.js';
import {QUANTUM_LABS} from '../../shared/quantum-configs.js';
import {drawQuantum} from '../../shared/quantum-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('von-neumann-entanglement-entropy',options,{config:QUANTUM_LABS['von-neumann-entanglement-entropy'],draw:drawQuantum});};
