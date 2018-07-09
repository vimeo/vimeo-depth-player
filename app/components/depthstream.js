
import * as THREE from 'three';

import GuiManager from './gui';

// bundling of GLSL code
const glsl = require('glslify');

class DepthStream{
  constructor(videoElementID, streamURL){

    //Save guard
    if(!videoElementID || !streamURL){
      console.warn('[Client] Depth stream video element not specified');
    }

    let fragSrc = glsl.file('../shaders/rgbd_stream.frag');
    let vertSrc = glsl.file('../shaders/rgbd_stream.vert');

    //Replace the URL - TODO if iOS mobile use HLS natively
    let url = streamURL.replace('hls', 'dash');

    //Create a DASH.js player
    this.player = dashjs.MediaPlayer().create();

    //Initialize the player
    this.player.initialize(document.querySelector("#" + videoElementID), url, true);

    //Get the video element
    this.videoElement = document.getElementById(videoElementID);

    //Create a THREE video texture
    this.streamVideoTex = new THREE.VideoTexture(this.videoElement);

    //Set filtering and type
    this.streamVideoTex.minFilter = THREE.NearestFilter;
    this.streamVideoTex.magFilter = THREE.LinearFilter;
    this.streamVideoTex.format = THREE.RGBFormat;
    this.streamVideoTex.generateMipmaps = false;

    this.material = new THREE.ShaderMaterial({
        uniforms: {
            "map": {
                type: "t",
                value: this.streamVideoTex
            }
        },
        vertexShader: vertSrc,
        fragmentShader: fragSrc,
        transparent: true
    });

    let geo = new THREE.PlaneBufferGeometry(1.3, 1, 256, 256);
    this.mesh = new THREE.Points(geo, this.material);

    this.mesh.stream = this;

    return this.mesh;
  }

}

export default DepthStream;
