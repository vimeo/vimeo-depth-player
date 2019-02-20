// Components
import DepthType from './depth-type'
import RenderStyle from './render-style'
import MeshDensity from './mesh-density'
import Props from './props'

// Libraries
const glsl = require('glslify')
import { Object3D } from 'three'

export default class DepthRenderer extends Object3D {
  constructor (_videoTexture = null,
    _metadata,
    _depthType = DepthType.DepthKit,
    _renderStyle = RenderStyle.Points,
    _meshDensity = MeshDensity.Medium) {

    super()

    if (!_videoTexture) {
      console.error('[DepthRenderer] Must provide a THREE.Texture or VimeoPlayer to create a DepthRenderer')
      return
    } 

    this.renderStyle = _renderStyle
    this.depthType = _depthType
    this.vertsTall = _meshDensity
    this.vertsWide = _meshDensity

    let rgbdFrag = glsl.file('../shaders/rgbd.frag')
    let rgbdVert = glsl.file('../shaders/rgbd.vert')
    
    const material = this.createMaterial(_videoTexture, this.depthType, rgbdVert, rgbdFrag)

    if (!DepthRenderer.geo) {
      DepthRenderer._buildGeomtery(this.vertsTall, this.vertsWide)
    }

    this._mesh = this.createMesh(this.renderStyle, material)

    if (_metadata) {
      this.loadMetadataFromObject(_metadata)
    } else {
      if (_depthType === DepthType.DepthKit) {
        this.loadMetadataFromObject(Props.DepthKit)
      } else {
        this.loadMetadataFromObject(Props.RealSense)
        this._mesh.material.defines.PIXEL_EDGE_CLIP = '1';
      }
    }

    // Attach it to the Object3D instance
    this.add(this._mesh)
  }

  /**
   * A factory method to create an instance of DepthRenderer from a Vimeo.Player instance
   * @param {object} _vimeoPlayer - The Vimeo three.js player to create a DepthRenderer from
   * @param {DepthType} _depthType - The type of depth renderering (default is Vimeo.DepthType.DepthKit)
   * @param {RenderStyle} _renderStyle - The render style (default is Vimeo.RenderStyle.Points)
   * @param {MeshDensity} _meshDensity - How tesselated is the geometry (defaut is MeshDensity.Medium)
   * @returns {DepthRenderer}
   */
  static fromPlayer (_vimeoPlayer, 
    _depthType = DepthType.DepthKit,
    _renderStyle = RenderStyle.Mesh) {

    if (!_vimeoPlayer) {
      console.error('[Vimeo DepthRenderer] Must provide a VimeoPlayer to instantiate a DepthRenderer this way')
      return
    }

    const intance = new DepthRenderer(_vimeoPlayer.texture, _vimeoPlayer.getMetadata(), _depthType, _renderStyle)

    return intance
  }

  /**
   * Create the depth renderer shader material
   * @param {DepthType} _type - The type of depth content to play
   * @param {string} _vertexShader - The vertex shader source program
   * @param {string} _fragmentShader - The fragment shder source program
   * @returns {THREE.ShaderMaterial}
   */
  createMaterial (_videoTexture, _type, _vertexShader, _fragmentShader) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        'map': {
          type: 't',
          value: _videoTexture
        },
        'time': {
          type: 'f',
          value: 0.0
        },
        'mindepth': {
          type: 'f',
          value: 0.0
        },
        'maxdepth': {
          type: 'f',
          value: 0.0
        },
        'meshDensity': {
          value: new THREE.Vector2(this.vertsWide, this.vertsTall)
        },
        'focalLength': {
          value: new THREE.Vector2(1, 1)
        },
        'principalPoint': {
          value: new THREE.Vector2(1, 1)
        },
        'imageDimensions': {
          value: new THREE.Vector2(512, 828)
        },
        'extrinsics': {
          value: new THREE.Matrix4()
        },
        'crop': {
          value: new THREE.Vector4(0, 0, 1, 1)
        },
        'width': {
          type: 'f',
          value: 0
        },
        'height': {
          type: 'f',
          value: 0
        },
        'opacity': {
          type: 'f',
          value: 1.0
        },
        'isPoints': {
          type: 'b',
          value: false
        },
        'pointSize': {
          type: 'f',
          value: 3.0
        }
      },
      vertexShader: _vertexShader,
      fragmentShader: _fragmentShader,
      transparent: true
    })

    // Make the shader material double sided
    material.side = THREE.DoubleSide

    if (_type === DepthType.DepthKit) {
      material.defines.DEPTH_ORDER = '1.0'
    } else if (_type === DepthType.RealSense) {
      material.defines.DEPTH_ORDER = '-1.0'
    }

    material.defines.PIXEL_EDGE_CLIP = '0'

    return material
  }

  /**
   * Internal method to create the DepthRenderer mesh based on the rendering style
   * @param {RenderStyle} _style - The rendering style (e.g Vimeo.RenderStyle.Points)
   * @param {THREE.ShaderMaterial} _material - The THREE.ShaderMaterial to create the mesh with
   * @returns {THREE.Mesh}
   */
  createMesh (_style, _material) {
    let mesh = null
    switch (_style) {
      case RenderStyle.Wire:
        _material.wireframe = true
        mesh = new THREE.Mesh(DepthRenderer.geo, _material)
        break

      case RenderStyle.Points:
        _material.uniforms.isPoints.value = true
        mesh = new THREE.Points(DepthRenderer.geo, _material)
        break

      default:
        mesh = new THREE.Mesh(DepthRenderer.geo, _material)
        break
    }

    mesh.frustumCulled = false
    mesh.name = 'depth-renderer'

    return mesh
  }

  /**
   * Load the material's proporties from a JSON object
   * @param {object} object - The JSON object with the proprties
   */
  loadMetadataFromObject (object) {
    // Update the shader based on the properties from the JSON
    if (object.textureWidth) {
      this._mesh.material.uniforms.width.value = object.textureWidth
    } else {
      this._mesh.material.uniforms.width.value = object.depthImageSize.x
    }

    if (object.textureHeight) {
      this._mesh.material.uniforms.height.value = object.textureHeight
    } else {
      this._mesh.material.uniforms.height.value = object.depthImageSize.y * 2
    }

    this._mesh.material.uniforms.mindepth.value = object.nearClip
    this._mesh.material.uniforms.maxdepth.value = object.farClip
    this._mesh.material.uniforms.focalLength.value = object.depthFocalLength
    this._mesh.material.uniforms.principalPoint.value = object.depthPrincipalPoint
    this._mesh.material.uniforms.imageDimensions.value = object.depthImageSize

    if (object.crop) {
      this._mesh.material.uniforms.crop.value = object.crop
    }

    let ex = object.extrinsics
    if (ex) {
      this._mesh.material.uniforms.extrinsics.value.set(
        ex['e00'], ex['e10'], ex['e20'], ex['e30'],
        ex['e01'], ex['e11'], ex['e21'], ex['e31'],
        ex['e02'], ex['e12'], ex['e22'], ex['e32'],
        ex['e03'], ex['e13'], ex['e23'], ex['e33']
      )
    }
  }

  /**
   * An internal method to create a fully tesselated grid geometry
   */
  static _buildGeomtery (_vertsTall, _vertsWide) {
    DepthRenderer.geo = new THREE.Geometry()

    for (let y = 0; y < _vertsTall; y++) {
      for (let x = 0; x < _vertsTall; x++) {
        DepthRenderer.geo.vertices.push(new THREE.Vector3(x, y, 0))
      }
    }
    for (let y = 0; y < _vertsTall - 1; y++) {
      for (let x = 0; x < _vertsWide - 1; x++) {
        DepthRenderer.geo.faces.push(
          new THREE.Face3(
            x + y * _vertsWide,
            x + (y + 1) * _vertsWide,
            (x + 1) + y * (_vertsWide)
          ))

        DepthRenderer.geo.faces.push(
          new THREE.Face3(
            x + 1 + y * _vertsWide,
            x + (y + 1) * _vertsWide,
            (x + 1) + (y + 1) * (_vertsWide)
          ))
      }
    }
  }

  /**
   * Set the size of the points rendered
   * @param {number} size - Size of the points (float)
   */
  setPointSize (size) {
    if (this.material.uniforms.isPoints.value) {
      this.material.uniforms.pointSize.value = size
    } else {
      console.warn('Can not set point size because the current character is not set to render points')
    }
  }

  /**
   * Set the mesh material opacity
   * @param {number} opacity - The opacity level to set (between 0.0 and 1.0)
   */
  setOpacity (opacity) {
    this.material.uniforms.opacity.value = opacity
  }

  setLineWidth (width) {
    if (this.material.wireframe) {
      this.material.wireframeLinewidth = width
    } else {
      console.warn('Can not set the line width because the current character is not set to render wireframe')
    }
  }

  /**
   * Update shader uniforms
   * @param {number} time - time uniform to be updated
   */
  update (time) {
    this.material.uniforms.time.value = time
  }

  /**
   * Delete the DepthRenderer and remove it from the scene
   */
  dispose () {
    try {
      this.parent.remove(this)
    } catch (e) {
      console.warn(e)
    } finally {
      this.traverse(child => {
        if (child.geometry !== undefined) {
          child.geometry.dispose()
          child.material.dispose()
        }
      })
    }
  }
}
