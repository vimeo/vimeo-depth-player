//DepthKit.js plugin for Three.js

/**
 * Originally written by
 * @author mrdoob / http://mrdoob.com
 * @modified by obviousjim / http://specular.cc
 */

/* Made into a plugin after the completion of the Tzina project by
 *  @author juniorxsound / http://orfleisher.com
 *  @modified by avnerus / http://avner.js.org
 */

import * as THREE from 'three';

import GuiManager from './gui';

// bundling of GLSL code
const glsl = require('glslify');

//For building the geomtery
const VERTS_WIDE = 256;
const VERTS_TALL = 256;

export default class DepthKit {

    constructor(_type = 'mesh', _props, _movie, appendVideoToDOM = false) {

        //Load the shaders
        let rgbdFrag = glsl.file('../shaders/rgbd.frag');
        let rgbdVert = glsl.file('../shaders/rgbd.vert');

        //Video element
        this.video = document.createElement('video');
        this.video.crossOrigin = 'anonymous';
        this.video.setAttribute('crossorigin', 'anonymous');
        this.video.src = _movie;
        this.video.autoplay = false;
        this.video.loop = false;
        this.video.id = 'depthkit-vimeo';

        //Append the original video from vimeo to the DOM
        if(appendVideoToDOM) document.body.append(this.video);

        //Create a video texture to be passed to the shader
        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.minFilter = THREE.NearestFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;
        this.videoTexture.generateMipmaps = false;

        //Manages loading of assets internally
        this.manager = new THREE.LoadingManager();

        //JSON props once loaded
        this.props;

        //Geomtery
        if (!DepthKit.geo) {
            DepthKit.buildGeomtery();
        }

        //Material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                "map": {
                    type: "t",
                    value: this.videoTexture
                },
                "time": {
                    type: "f",
                    value: 0.0
                },
                "mindepth": {
                    type: "f",
                    value: 0.0
                },
                "maxdepth": {
                    type: "f",
                    value: 0.0
                },
                "meshDensity": {
                    value: new THREE.Vector2(VERTS_WIDE, VERTS_TALL)
                },
                "focalLength": {
                    value: new THREE.Vector2(1,1)
                },
                "principalPoint": {
                    value: new THREE.Vector2(1,1)
                },
                "imageDimensions": {
                    value: new THREE.Vector2(512,828)
                },
                "extrinsics": {
                    value: new THREE.Matrix4()
                },
                "crop": {
                    value: new THREE.Vector4(0,0,1,1)
                },
                "width": {
                    type: "f",
                    value: 0
                },
                "height": {
                    type: "f",
                    value: 0
                },
                "opacity": {
                    type: "f",
                    value: 1.0
                },
                "isPoints": {
                    type: "b",
                    value: false
                },
                "pointSize": {
                    type: "f",
                    value: 3.0
                }
            },
            vertexShader: rgbdVert,
            fragmentShader: rgbdFrag,
            transparent: true
        });

        //Make the shader material double sided
        this.material.side = THREE.DoubleSide;

        //Switch a few things based on selected rendering type and create the mesh
        switch (_type) {
            case 'wire':
                this.material.wireframe = true;
                this.mesh = new THREE.Mesh(DepthKit.geo, this.material);
                break;

            case 'points':
                this.material.uniforms.isPoints.value = true;
                this.mesh = new THREE.Points(DepthKit.geo, this.material);
                break;

            default:
                this.mesh = new THREE.Mesh(DepthKit.geo, this.material);
                break;
        }

        if(typeof _props === 'object'){
          this.loadPropsFromObject(_props);
        } else {
          this.loadPropsFromFile(_props);
        }

        //Make sure we don't hide the character - this helps the objects in webVR
        this.mesh.frustumCulled = false;

        //Apend the object to the Three Object3D that way it's accsesable from the instance
        this.mesh.depthkit = this;
        this.mesh.name = 'depthkit';

        //Return the object3D so it could be added to the scene
        return this.mesh;
    }
    loadPropsFromObject(object){
      //Update the shader based on the properties from the JSON
      this.material.uniforms.width.value = object.textureWidth;
      this.material.uniforms.height.value = object.textureHeight;
      this.material.uniforms.mindepth.value = object.nearClip;
      this.material.uniforms.maxdepth.value = object.farClip;
      this.material.uniforms.focalLength.value = object.depthFocalLength;
      this.material.uniforms.principalPoint.value = object.depthPrincipalPoint;
      this.material.uniforms.imageDimensions.value = object.depthImageSize;
      this.material.uniforms.crop.value = object.crop;

      let ex = object.extrinsics;
      this.material.uniforms.extrinsics.value.set(
          ex["e00"], ex["e10"], ex["e20"], ex["e30"],
          ex["e01"], ex["e11"], ex["e21"], ex["e31"],
          ex["e02"], ex["e12"], ex["e22"], ex["e32"],
          ex["e03"], ex["e13"], ex["e23"], ex["e33"],
      );

      //Create the collider
      let boxGeo = new THREE.BoxGeometry(object.boundsSize.x, object.boundsSize.y, object.boundsSize.z);
      let boxMat = new THREE.MeshBasicMaterial(
          {
              color: 0xffff00,
              wireframe: true
          }
      );

      this.collider = new THREE.Mesh(boxGeo, boxMat);


      this.collider.visible = false;
      this.mesh.add(this.collider);

      //Temporary collider positioning fix - // TODO: fix that with this.props.boundsCenter
      this.collider.position.set(0,1,0);
    }
    loadPropsFromFile(path){
      //Make sure to read the config file as json (i.e JSON.parse)
      this.jsonLoader = new THREE.FileLoader(this.manager);
      this.jsonLoader.setResponseType('json');
      this.jsonLoader.load(path,
          // Function when json is loaded
          data => {
              this.props = data;
              // console.log(this.props);

              //Update the shader based on the properties from the JSON
              this.material.uniforms.width.value = this.props.textureWidth;
              this.material.uniforms.height.value = this.props.textureHeight;
              this.material.uniforms.mindepth.value = this.props.nearClip;
              this.material.uniforms.maxdepth.value = this.props.farClip;
              this.material.uniforms.focalLength.value = this.props.depthFocalLength;
              this.material.uniforms.principalPoint.value = this.props.depthPrincipalPoint;
              this.material.uniforms.imageDimensions.value = this.props.depthImageSize;
              this.material.uniforms.crop.value = this.props.crop;

              let ex = this.props.extrinsics;
              this.material.uniforms.extrinsics.value.set(
                  ex["e00"], ex["e10"], ex["e20"], ex["e30"],
                  ex["e01"], ex["e11"], ex["e21"], ex["e31"],
                  ex["e02"], ex["e12"], ex["e22"], ex["e32"],
                  ex["e03"], ex["e13"], ex["e23"], ex["e33"],
              );

              //Create the collider
              let boxGeo = new THREE.BoxGeometry(this.props.boundsSize.x, this.props.boundsSize.y, this.props.boundsSize.z);
              let boxMat = new THREE.MeshBasicMaterial(
                  {
                      color: 0xffff00,
                      wireframe: true
                  }
              );

              this.collider = new THREE.Mesh(boxGeo, boxMat);


              this.collider.visible = false;
              this.mesh.add(this.collider);

              //Temporary collider positioning fix - // TODO: fix that with this.props.boundsCenter
              THREE.SceneUtils.detach(this.collider, this.mesh, this.mesh.parent);
              this.collider.position.set(0,1,0);
          }
      );
    }

     static buildGeomtery() {

        DepthKit.geo = new THREE.Geometry();

        for (let y = 0; y < VERTS_TALL; y++) {
            for (let x = 0; x < VERTS_WIDE; x++) {
                DepthKit.geo.vertices.push(new THREE.Vector3(x, y, 0));
            }
        }
        for (let y = 0; y < VERTS_TALL - 1; y++) {
            for (let x = 0; x < VERTS_WIDE - 1; x++) {
                DepthKit.geo.faces.push(
                    new THREE.Face3(
                        x + y * VERTS_WIDE,
                        x + (y + 1) * VERTS_WIDE,
                        (x + 1) + y * (VERTS_WIDE)
                    ));
                DepthKit.geo.faces.push(
                    new THREE.Face3(
                        x + 1 + y * VERTS_WIDE,
                        x + (y + 1) * VERTS_WIDE,
                        (x + 1) + (y + 1) * (VERTS_WIDE)
                    ));
            }
        }
    }

    /*
    * Render related methods
    */
    setPointSize(size) {
        if (this.material.uniforms.isPoints.value) {
            this.material.uniforms.pointSize.value = size;
        } else {
            console.warn('Can not set point size because the current character is not set to render points');
        }
    }

    setOpacity(opacity) {
        this.material.uniforms.opacity.value = opacity;
    }

    setLineWidth(width){
      if (this.material.wireframe){
        this.material.wireframeLinewidth = width;
      } else {
        console.warn('Can not set the line width because the current character is not set to render wireframe');
      }
    }

    /*
    * Video Player methods
    */
    play() {
        if (!this.video.isPlaying) {
            this.video.play();
        } else {
            console.warn('Can not play because the character is already playing');
        }
    }

    stop() {
        this.video.currentTime = 0.0;
        this.video.pause();
    }

    pause() {
        this.video.pause();
    }

    setLoop(isLooping) {
        this.video.loop = isLooping;
    }

    setVolume(volume) {
        this.video.volume = volume;
    }

    update(time) {
        this.material.uniforms.time.value = time;
    }

    toggleColliderVisiblity(){
      this.mesh.collider.visible = !this.mesh.collider.visible;
    }

    dispose() {
      //Remove the mesh from the scene
      try {
        this.mesh.parent.remove(this.mesh);
      } catch (e) {
        console.warn(e);
      } finally {
        this.mesh.traverse(child=>{
          if(child.geometry !== undefined){
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    }
}
