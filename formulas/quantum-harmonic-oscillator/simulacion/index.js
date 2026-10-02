import {mountLab} from '../../shared/learning-lab.js';
import {QUANTUM_LABS} from '../../shared/quantum-configs.js';
import {drawQuantum} from '../../shared/quantum-draw.js';
export default options=>{options.root.classList.add('studio-lab');return mountLab('quantum-harmonic-oscillator',options,{config:QUANTUM_LABS['quantum-harmonic-oscillator'],draw:drawQuantum});};
