import * as THREE from 'three';

// Orbit controls wrapper for modularity
import OrbitControls from './controls';
OrbitControls(THREE);

// Some Util stuff
import Util from './util';

// Event emitter implementation for ES6
import EventEmitter from 'event-emitter-es6';

class Scene extends EventEmitter {
  constructor(domElement, clearColor = 'black') {

    //Since we extend EventEmitter we need to instance it from here
    super();

    //Check if WebGL is supported on the browser and emit an event
    this.hasGL = Util.checkWebGL();

    this.emit('webgl_support', this.hasGL);

    if (!this.hasGL) return;

    let fontLoader = new THREE.FontLoader();
    fontLoader.load('/assets/helvetiker.json', (font)=>{
      this.font = font;
    });

    //THREE scene
    this.scene = new THREE.Scene();

    //Set the height and weight
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.light = new THREE.PointLight();
    this.light.position.set(0, 2.5, 0);
    this.scene.add(this.light);

    //THREE Camera
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 3.5;
    this.camera.position.y = 0.5;

    //THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true
    });

    //Renderer props
    this.renderer.setClearColor(new THREE.Color(clearColor));
    if(window.devicePixelRatio) {
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.renderer.vr.enabled = true;
    this.renderer.setSize(this.width, this.height);

    if(domElement == null){
      domElement = document.getElementById('gl_canvas_container');
    }

    //Push the canvas to the DOM
    domElement.append(this.renderer.domElement);

    //Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.autoRotate = true;

    let grid = new THREE.GridHelper();
    // this.scene.add(grid);

    //Setup event listeners for events and handle the states
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    window.addEventListener('mousemove', e => this.onMouseMove(e), false);

    this.controls.target = new THREE.Vector3(0.0, 0.5, -0.5);

    this.update();

  }

  update() {
    //Request the next frame and allow accses to hook into the render loop from outside
    requestAnimationFrame(() => {
      this.update();
      this.emit('tick');
    });

    this.controls.update();

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(e) {
    // Full width and height
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Camera aspect ratio
    this.camera.aspect = this.width / this.height;

    //Update MVP
    this.camera.updateProjectionMatrix();

    //Set the renderer size
    this.renderer.setSize(this.width, this.height);

  }

  onMouseMove(e){
    // this.recenteredX = ((e.clientX / window.innerWidth) * 2) - 1;
    // this.recenteredY = ((((e.clientY / window.innerHeight) * -1.0) + 1.0) * 2) - 1;
    // this.camera.position.x = this.recenteredX;
    // this.camera.position.y = this.recenteredY;
  }
}

export default Scene;
