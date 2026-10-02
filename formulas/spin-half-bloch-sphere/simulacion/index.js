import {mountLab} from '../../shared/learning-lab.js';
import {QUANTUM_LABS} from '../../shared/quantum-configs.js';
import {drawQuantum} from '../../shared/quantum-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('spin-half-bloch-sphere',options,{config:QUANTUM_LABS['spin-half-bloch-sphere'],draw:drawQuantum});};
