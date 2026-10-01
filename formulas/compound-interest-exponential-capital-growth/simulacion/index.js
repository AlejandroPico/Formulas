import {mountLab} from '../../shared/learning-lab.js';
import {FRONTIER_LABS} from '../../shared/frontier-configs.js';
import {drawFrontier} from '../../shared/frontier-draw.js';
export default options=>mountLab('compound-interest-exponential-capital-growth',options,{config:FRONTIER_LABS['compound-interest-exponential-capital-growth'],draw:drawFrontier});
