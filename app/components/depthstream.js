
import * as THREE from 'three';

import GuiManager from './gui';

import Util from './util';

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


    if(Util.isiOS()){
      this.videoElement = document.getElementById(videoElementID);
      this.videoElement.src = streamURL;
      this.videoElement.crossOrigin = '*';
      this.videoElement.load();
      this.videoElement.addEventListener("contextmenu", e=>{
        e.preventDefault();
        e.stopPropagation();
      }, false);
      if (this.videoElement.hasAttribute("controls")) {
            this.videoElement.removeAttribute("controls")
      }
    } else {
      //Replace the URL - TODO if iOS mobile use HLS natively
      let url = streamURL.replace('hls', 'dash');

      //Create a DASH.js player
      this.player = dashjs.MediaPlayer().create();

      //Initialize the player
      this.player.initialize(document.querySelector("#" + videoElementID), url, true);

      //Get the video element
      this.videoElement = document.getElementById(videoElementID);
    }


    //GUI functionality
    this.gui = new GuiManager();
    this.gui.addFunction('Play', ()=>{
      this.videoElement.play();
    });
    this.gui.addFunction('Stop', ()=>{
      this.videoElement.pause();
    });

    //Create a THREE video texture
    this.streamVideoTex = new THREE.VideoTexture( this.videoElement );
    this.streamVideoTex.needsUpdate = true;

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
    this.mesh = new THREE.Mesh(geo, this.material);

    this.mesh.stream = this;

    return this.mesh;
  }
  update(){
    this.streamVideoTex.needsUpdate = true;
  }
}

export default DepthStream;
