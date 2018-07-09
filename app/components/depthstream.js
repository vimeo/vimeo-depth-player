
import * as THREE from 'three';

import GuiManager from './gui';

// bundling of GLSL code
const glsl = require('glslify');

class DepthStream(){
  constructor(videoElement){
    if(!videoElement){
      console.warn('[Client] Depth stream video element not specified');
    }
    this.videoElm = videoElm;
  }

  buildGeomtery(){

  }
}

export default
