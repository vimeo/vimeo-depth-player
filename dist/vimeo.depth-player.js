(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_VALUES = {
    emitDelay: 10,
    strictMode: false
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */

var EventEmitter = function () {

    /**
     * @constructor
     * @param {{}}      [opts]
     * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
     * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
     */

    function EventEmitter() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_VALUES : arguments[0];

        _classCallCheck(this, EventEmitter);

        var emitDelay = void 0,
            strictMode = void 0;

        if (opts.hasOwnProperty('emitDelay')) {
            emitDelay = opts.emitDelay;
        } else {
            emitDelay = DEFAULT_VALUES.emitDelay;
        }
        this._emitDelay = emitDelay;

        if (opts.hasOwnProperty('strictMode')) {
            strictMode = opts.strictMode;
        } else {
            strictMode = DEFAULT_VALUES.strictMode;
        }
        this._strictMode = strictMode;

        this._listeners = {};
        this.events = [];
    }

    /**
     * @protected
     * @param {string} type
     * @param {function} listener
     * @param {boolean} [once = false]
     */


    _createClass(EventEmitter, [{
        key: '_addListenner',
        value: function _addListenner(type, listener, once) {
            if (typeof listener !== 'function') {
                throw TypeError('listener must be a function');
            }

            if (this.events.indexOf(type) === -1) {
                this._listeners[type] = [{
                    once: once,
                    fn: listener
                }];
                this.events.push(type);
            } else {
                this._listeners[type].push({
                    once: once,
                    fn: listener
                });
            }
        }

        /**
         * Subscribes on event type specified function
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'on',
        value: function on(type, listener) {
            this._addListenner(type, listener, false);
        }

        /**
         * Subscribes on event type specified function to fire only once
         * @param {string} type
         * @param {function} listener
         */

    }, {
        key: 'once',
        value: function once(type, listener) {
            this._addListenner(type, listener, true);
        }

        /**
         * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
         * @param {string} eventType
         * @param {function} [listenerFunc]
         */

    }, {
        key: 'off',
        value: function off(eventType, listenerFunc) {
            var _this = this;

            var typeIndex = this.events.indexOf(eventType);
            var hasType = eventType && typeIndex !== -1;

            if (hasType) {
                if (!listenerFunc) {
                    delete this._listeners[eventType];
                    this.events.splice(typeIndex, 1);
                } else {
                    (function () {
                        var removedEvents = [];
                        var typeListeners = _this._listeners[eventType];

                        typeListeners.forEach(
                        /**
                         * @param {EventEmitterListenerFunc} fn
                         * @param {number} idx
                         */
                        function (fn, idx) {
                            if (fn.fn === listenerFunc) {
                                removedEvents.unshift(idx);
                            }
                        });

                        removedEvents.forEach(function (idx) {
                            typeListeners.splice(idx, 1);
                        });

                        if (!typeListeners.length) {
                            _this.events.splice(typeIndex, 1);
                            delete _this._listeners[eventType];
                        }
                    })();
                }
            }
        }

        /**
         * Applies arguments to specified event type
         * @param {string} eventType
         * @param {*[]} eventArguments
         * @protected
         */

    }, {
        key: '_applyEvents',
        value: function _applyEvents(eventType, eventArguments) {
            var typeListeners = this._listeners[eventType];

            if (!typeListeners || !typeListeners.length) {
                if (this._strictMode) {
                    throw 'No listeners specified for event: ' + eventType;
                } else {
                    return;
                }
            }

            var removableListeners = [];
            typeListeners.forEach(function (eeListener, idx) {
                eeListener.fn.apply(null, eventArguments);
                if (eeListener.once) {
                    removableListeners.unshift(idx);
                }
            });

            removableListeners.forEach(function (idx) {
                typeListeners.splice(idx, 1);
            });
        }

        /**
         * Emits event with specified type and params.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emit',
        value: function emit(type) {
            var _this2 = this;

            for (var _len = arguments.length, eventArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                eventArgs[_key - 1] = arguments[_key];
            }

            if (this._emitDelay) {
                setTimeout(function () {
                    _this2._applyEvents.call(_this2, type, eventArgs);
                }, this._emitDelay);
            } else {
                this._applyEvents(type, eventArgs);
            }
        }

        /**
         * Emits event with specified type and params synchronously.
         * @param {string} type
         * @param eventArgs
         */

    }, {
        key: 'emitSync',
        value: function emitSync(type) {
            for (var _len2 = arguments.length, eventArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                eventArgs[_key2 - 1] = arguments[_key2];
            }

            this._applyEvents(type, eventArgs);
        }

        /**
         * Destroys EventEmitter
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this._listeners = {};
            this.events = [];
        }
    }]);

    return EventEmitter;
}();

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _depthType2 = require('./depth-type');

var _depthType3 = _interopRequireDefault(_depthType2);

var _props2 = require('./props');

var _props3 = _interopRequireDefault(_props2);

var _renderStyle = require('./render-style');

var _renderStyle2 = _interopRequireDefault(_renderStyle);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// GLSLIFY - bundles all the GLSL code along with the JS
var glsl = require('glslify');

var EventEmitter = require('event-emitter-es6');

/*
 * TODO add documentation
 */

// For building the geomtery
var VERTS_WIDE = 256;
var VERTS_TALL = 256;

var DepthPlayer = function (_EventEmitter) {
  _inherits(DepthPlayer, _EventEmitter);

  function DepthPlayer() {
    var _vimeoVideoId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var _videoQuality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';

    var _depthType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _depthType3.default.DepthKit;

    var _depthStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _renderStyle2.default.Points;

    _classCallCheck(this, DepthPlayer);

    var _this = _possibleConstructorReturn(this, (DepthPlayer.__proto__ || Object.getPrototypeOf(DepthPlayer)).call(this));

    _this.vimeoVideoId = _vimeoVideoId;
    _this.videoQuality = _videoQuality;
    _this.depthStyle = _depthStyle;
    _this.depthType = _depthType;
    _this.videoElement = document.createElement('video');
    return _this;
  }

  _createClass(DepthPlayer, [{
    key: 'load',
    value: function load() {
      var _this2 = this;

      var vimeo = new Vimeo.API(this.videoQuality);
      return new Promise(function (resolve, reject) {
        vimeo.requestVideo(_this2.vimeoVideoId).then(function (response) {
          _this2.videoUrl = response.url;
          _this2.loadVideo(response.props, response.url, response.selectedQuality, response.type || _this2.depthType, _this2.depthStyle);

          resolve({});
        });
      });
    }

    // TODO Rename selectedQuality - it is about if it's adaptive or not?

  }, {
    key: 'loadVideo',
    value: function loadVideo(_props, _videoUrl, _selectedQuality) {
      var _type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _depthType3.default.DepthKit;

      var _style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _renderStyle2.default.Points;

      var showVideo = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      console.log('[DepthPlayer] Creating a depth player with selected quality: ' + _selectedQuality);

      if (_videoUrl == null) {
        console.warn('[DepthPlayer] No video provided');
        return;
      }
      if (_selectedQuality == null) {
        console.warn('[DepthPlayer] No selected quality set');
        return;
      }

      // Load the shaders src
      var rgbdFrag = glsl(["#define GLSLIFY 1\nuniform sampler2D map;\nuniform float opacity;\n\nuniform float uvdy;\nuniform float uvdx;\n\nvarying float visibility;\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vPos;\n\nvoid main() {\n\n    if ( visibility < 0.9 ) discard;\n    vec4 color = texture2D(map, vUv);\n\n    //For live streaming only to clip the black per pixel\n    if(PIXEL_EDGE_CLIP == 1){\n      if( color.r < 0.05 ) discard;\n    }\n\n    color.w = opacity;\n\n    gl_FragColor = color;\n\n}\n"]);
      var rgbdVert = glsl(["#define GLSLIFY 1\nuniform float mindepth;\nuniform float maxdepth;\n\nuniform float width;\nuniform float height;\n\nuniform bool isPoints;\nuniform float pointSize;\n\nuniform float time;\n\nuniform vec2 focalLength;\nuniform vec2 principalPoint;\nuniform vec2 imageDimensions;\nuniform vec4 crop;\nuniform vec2 meshDensity;\nuniform mat4 extrinsics;\n\nvarying vec3 vNormal;\nvarying vec3 vPos;\n\nuniform sampler2D map;\n\nvarying float visibility;\nvarying vec2 vUv;\n\nconst float _DepthSaturationThreshhold = 0.5; //a given pixel whose saturation is less than half will be culled (old default was .5)\nconst float _DepthBrightnessThreshold = 0.5; //a given pixel whose brightness is less than half will be culled (old default was .9)\nconst float  _Epsilon = .03;\n\nvec3 rgb2hsv(vec3 c)\n{\n    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n    float d = q.x - min(q.w, q.y);\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + _Epsilon)), d / (q.x + _Epsilon), q.x);\n}\n\nfloat depthForPoint(vec2 texturePoint)\n{\n    vec4 depthsample = texture2D(map, texturePoint);\n    vec3 depthsamplehsv = rgb2hsv(depthsample.rgb);\n    return depthsamplehsv.g > _DepthSaturationThreshhold && depthsamplehsv.b > _DepthBrightnessThreshold ? depthsamplehsv.r : 0.0;\n}\n\nvoid main() {\n    vec4 texSize = vec4(1.0 / width, 1.0 / height, width, height);\n\n    vec2 centerpix = texSize.xy * .5;\n    vec2 textureStep = 1.0 / meshDensity;\n    vec2 basetex = floor(position.xy * textureStep * texSize.zw) * texSize.xy;\n    vec2 imageCoordinates = crop.xy + (basetex * crop.zw);\n    basetex.y = 1.0 - basetex.y;\n\n    vec2 depthTexCoord = basetex * vec2(1.0, 0.5) + centerpix;\n    vec2 colorTexCoord = basetex * vec2(1.0, 0.5) + vec2(0.0, 0.5) + centerpix;\n\n    vUv = colorTexCoord;\n    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;\n    vNormal = normalMatrix * normal;\n\n    //check neighbors\n    //texture coords come in as [0.0 - 1.0] for this whole plane\n    float depth = depthForPoint(depthTexCoord);\n\n    float neighborDepths[8];\n    neighborDepths[0] = depthForPoint(depthTexCoord + vec2(0.0,  textureStep.y));\n    neighborDepths[1] = depthForPoint(depthTexCoord + vec2(textureStep.x, 0.0));\n    neighborDepths[2] = depthForPoint(depthTexCoord + vec2(0.0, -textureStep.y));\n    neighborDepths[3] = depthForPoint(depthTexCoord + vec2(-textureStep.x, 0.0));\n    neighborDepths[4] = depthForPoint(depthTexCoord + vec2(-textureStep.x, -textureStep.y));\n    neighborDepths[5] = depthForPoint(depthTexCoord + vec2(textureStep.x,  textureStep.y));\n    neighborDepths[6] = depthForPoint(depthTexCoord + vec2(textureStep.x, -textureStep.y));\n    neighborDepths[7] = depthForPoint(depthTexCoord + vec2(-textureStep.x,  textureStep.y));\n\n    visibility = 1.0;\n    int numDudNeighbors = 0;\n    //search neighbor verts in order to see if we are near an edge\n    //if so, clamp to the surface closest to us\n    if (depth < _Epsilon || (1.0 - depth) < _Epsilon)\n    {\n        // float depthDif = 1.0;\n        float nearestDepth = 1.0;\n        for (int i = 0; i < 8; i++)\n        {\n            float depthNeighbor = neighborDepths[i];\n            if (depthNeighbor >= _Epsilon && (1.0 - depthNeighbor) > _Epsilon)\n            {\n                // float thisDif = abs(nearestDepth - depthNeighbor);\n                if (depthNeighbor < nearestDepth)\n                {\n                    // depthDif = thisDif;\n                    nearestDepth = depthNeighbor;\n                }\n            }\n            else\n            {\n                numDudNeighbors++;\n            }\n        }\n\n        depth = nearestDepth;\n        visibility = 0.8;\n\n        // blob filter\n        if (numDudNeighbors > 6)\n        {\n            visibility = 0.0;\n        }\n    }\n\n    // internal edge filter\n    float maxDisparity = 0.0;\n    for (int i = 0; i < 8; i++)\n    {\n        float depthNeighbor = neighborDepths[i];\n        if (depthNeighbor >= _Epsilon && (1.0 - depthNeighbor) > _Epsilon)\n        {\n            maxDisparity = max(maxDisparity, abs(depth - depthNeighbor));\n        }\n    }\n    visibility *= 1.0 - maxDisparity;\n\n    float z = (depth * (maxdepth - mindepth) + mindepth) * DEPTH_ORDER;\n    vec4 worldPos = extrinsics * vec4((imageCoordinates * imageDimensions - principalPoint) * z / focalLength, z, 1.0);\n    worldPos.w = 1.0;\n    if(isPoints) gl_PointSize = pointSize;\n    gl_Position = projectionMatrix * modelViewMatrix * worldPos;\n}\n"]);

      this.videoElement.id = 'vimeo-depth-player'; // TODO Must be unique ID
      this.videoElement.crossOrigin = 'anonymous';
      this.videoElement.setAttribute('crossorigin', 'anonymous');
      this.videoElement.autoplay = false;
      this.videoElement.loop = true;

      // When the video is done loading, trigger the load event
      this.videoElement.addEventListener('loadeddata', function () {
        if (this.videoElement.readyState >= 3) {
          this.emit('load');
        }
      }.bind(this));

      // Adaptive DASH playback uses DepthJS
      if (_selectedQuality === 'dash') {
        // Create a DASH.js player
        this.video = dashjs.MediaPlayer().create();
        this.video.initialize(this.videoElement, _videoUrl, false);

        this.createTexture(this.videoElement);
      }
      // Otherwise fallback to standard video element
      else {
          this.video = this.videoElement;

          if (_util2.default.isiOS()) {
            this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
            this.video.setAttribute('playsinline', 'playsinline');
          }
          this.video.src = _videoUrl;
          this.video.load();

          this.createTexture(this.video);
        }

      // Append the original video from vimeo to the DOM
      if (showVideo) document.body.append(this.video);

      // Manages loading of assets internally
      this.manager = new THREE.LoadingManager();

      // JSON props once loaded
      this.props;

      if (!DepthPlayer.geo) {
        DepthPlayer.buildGeomtery();
      }

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
            value: new THREE.Vector2(1, 1)
          },
          "principalPoint": {
            value: new THREE.Vector2(1, 1)
          },
          "imageDimensions": {
            value: new THREE.Vector2(512, 828)
          },
          "extrinsics": {
            value: new THREE.Matrix4()
          },
          "crop": {
            value: new THREE.Vector4(0, 0, 1, 1)
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

      // Make the shader material double sided
      this.material.side = THREE.DoubleSide;

      if (_type === _depthType3.default.DepthKit) {
        this.material.defines.DEPTH_ORDER = '1.0';

        if (_props == null) {
          _props = _props3.default.DepthKit;
        }
      } else if (_type === _depthType3.default.RealSense) {
        this.material.defines.DEPTH_ORDER = '-1.0';
        if (_props == null) {
          _props = _props3.default.RealSense;
        }
      }
      this.material.defines.PIXEL_EDGE_CLIP = '0';
      // Switch a few things based on selected rendering type and create the volumetric asset
      switch (_style) {
        case _renderStyle2.default.Wire:
          this.material.wireframe = true;
          this.mesh = new THREE.Mesh(DepthPlayer.geo, this.material);
          break;

        case _renderStyle2.default.Points:
          this.material.uniforms.isPoints.value = true;
          this.mesh = new THREE.Points(DepthPlayer.geo, this.material);
          break;

        default:
          this.mesh = new THREE.Mesh(DepthPlayer.geo, this.material);
          break;
      }

      this.loadPropsFromObject(_props);

      // Make sure we don't hide the character - this helps the objects in webVR
      this.mesh.frustumCulled = false;

      // Apend the object to the Three Object3D that way it's accsesable from the instance
      this.mesh.player = this;
      this.mesh.name = 'depth-player';

      // Return the object3D so it could be added to the scene
      return this.mesh;
    }

    // Create a video texture to be passed to the shader

  }, {
    key: 'createTexture',
    value: function createTexture(videoElement) {
      this.videoTexture = new THREE.VideoTexture(videoElement);
      this.videoTexture.minFilter = THREE.NearestFilter;
      this.videoTexture.magFilter = THREE.LinearFilter;
      this.videoTexture.format = THREE.RGBFormat;
      this.videoTexture.generateMipmaps = false;
    }
  }, {
    key: 'loadPropsFromObject',
    value: function loadPropsFromObject(object) {
      // Update the shader based on the properties from the JSON
      this.material.uniforms.width.value = object.textureWidth;
      this.material.uniforms.height.value = object.textureHeight;
      this.material.uniforms.mindepth.value = object.nearClip;
      this.material.uniforms.maxdepth.value = object.farClip;
      this.material.uniforms.focalLength.value = object.depthFocalLength;
      this.material.uniforms.principalPoint.value = object.depthPrincipalPoint;
      this.material.uniforms.imageDimensions.value = object.depthImageSize;
      this.material.uniforms.crop.value = object.crop;

      var ex = object.extrinsics;
      this.material.uniforms.extrinsics.value.set(ex["e00"], ex["e10"], ex["e20"], ex["e30"], ex["e01"], ex["e11"], ex["e21"], ex["e31"], ex["e02"], ex["e12"], ex["e22"], ex["e32"], ex["e03"], ex["e13"], ex["e23"], ex["e33"]);

      // Create the collider
      var boxGeo = new THREE.BoxGeometry(object.boundsSize.x, object.boundsSize.y, object.boundsSize.z);
      var boxMat = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });

      this.collider = new THREE.Mesh(boxGeo, boxMat);

      this.collider.visible = false;
      this.mesh.add(this.collider);

      // Temporary collider positioning fix - // TODO: fix that with this.props.boundsCenter
      this.collider.position.set(0, 1, 0);
    }
  }, {
    key: 'loadPropsFromFile',
    value: function loadPropsFromFile(path) {
      var _this3 = this;

      // Make sure to read the config file as json (i.e JSON.parse)
      this.jsonLoader = new THREE.FileLoader(this.manager);
      this.jsonLoader.setResponseType('json');
      this.jsonLoader.load(path,
      // Function when json is loaded
      function (data) {
        _this3.props = data;
        // console.log(this.props);

        // Update the shader based on the properties from the JSON
        _this3.material.uniforms.width.value = _this3.props.textureWidth;
        _this3.material.uniforms.height.value = _this3.props.textureHeight;
        _this3.material.uniforms.mindepth.value = _this3.props.nearClip;
        _this3.material.uniforms.maxdepth.value = _this3.props.farClip;
        _this3.material.uniforms.focalLength.value = _this3.props.depthFocalLength;
        _this3.material.uniforms.principalPoint.value = _this3.props.depthPrincipalPoint;
        _this3.material.uniforms.imageDimensions.value = _this3.props.depthImageSize;
        _this3.material.uniforms.crop.value = _this3.props.crop;

        var ex = _this3.props.extrinsics;
        _this3.material.uniforms.extrinsics.value.set(ex["e00"], ex["e10"], ex["e20"], ex["e30"], ex["e01"], ex["e11"], ex["e21"], ex["e31"], ex["e02"], ex["e12"], ex["e22"], ex["e32"], ex["e03"], ex["e13"], ex["e23"], ex["e33"]);

        // Create the collider
        var boxGeo = new THREE.BoxGeometry(_this3.props.boundsSize.x, _this3.props.boundsSize.y, _this3.props.boundsSize.z);
        var boxMat = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          wireframe: true
        });

        _this3.collider = new THREE.Mesh(boxGeo, boxMat);

        _this3.collider.visible = false;
        _this3.mesh.add(_this3.collider);

        // Temporary collider positioning fix - // TODO: fix that with this.props.boundsCenter
        THREE.SceneUtils.detach(_this3.collider, _this3.mesh, _this3.mesh.parent);
        _this3.collider.position.set(0, 1, 0);
      });
    }
  }, {
    key: 'setPointSize',


    /*
     * Render related methods
     */
    value: function setPointSize(size) {
      if (this.material.uniforms.isPoints.value) {
        this.material.uniforms.pointSize.value = size;
      } else {
        console.warn('Can not set point size because the current character is not set to render points');
      }
    }
  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.material.uniforms.opacity.value = opacity;
    }
  }, {
    key: 'setLineWidth',
    value: function setLineWidth(width) {
      if (this.material.wireframe) {
        this.material.wireframeLinewidth = width;
      } else {
        console.warn('Can not set the line width because the current character is not set to render wireframe');
      }
    }

    /*
     * Video Player methods
     */

  }, {
    key: 'play',
    value: function play() {
      if (!this.video.isPlaying) {
        this.video.play();
      } else {
        console.warn('Can not play because the character is already playing');
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.video.currentTime = 0.0;
      this.video.pause();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.video.pause();
    }
  }, {
    key: 'setLoop',
    value: function setLoop(isLooping) {
      this.video.loop = isLooping;
    }
  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.video.volume = volume;
    }
  }, {
    key: 'update',
    value: function update(time) {
      this.material.uniforms.time.value = time;
    }
  }, {
    key: 'toggleColliderVisiblity',
    value: function toggleColliderVisiblity() {
      this.mesh.collider.visible = !this.mesh.collider.visible;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // Remove the mesh from the scene
      try {
        this.mesh.parent.remove(this.mesh);
      } catch (e) {
        console.warn(e);
      } finally {
        this.mesh.traverse(function (child) {
          if (child.geometry !== undefined) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    }
  }], [{
    key: 'buildGeomtery',
    value: function buildGeomtery() {

      DepthPlayer.geo = new THREE.Geometry();

      for (var y = 0; y < VERTS_TALL; y++) {
        for (var x = 0; x < VERTS_WIDE; x++) {
          DepthPlayer.geo.vertices.push(new THREE.Vector3(x, y, 0));
        }
      }
      for (var _y = 0; _y < VERTS_TALL - 1; _y++) {
        for (var _x8 = 0; _x8 < VERTS_WIDE - 1; _x8++) {
          DepthPlayer.geo.faces.push(new THREE.Face3(_x8 + _y * VERTS_WIDE, _x8 + (_y + 1) * VERTS_WIDE, _x8 + 1 + _y * VERTS_WIDE));

          DepthPlayer.geo.faces.push(new THREE.Face3(_x8 + 1 + _y * VERTS_WIDE, _x8 + (_y + 1) * VERTS_WIDE, _x8 + 1 + (_y + 1) * VERTS_WIDE));
        }
      }
    }
  }]);

  return DepthPlayer;
}(EventEmitter);

exports.default = DepthPlayer;

},{"./depth-type":4,"./props":5,"./render-style":6,"./util":7,"event-emitter-es6":1,"glslify":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DepthType = {
  DepthKit: 0,
  RealSense: 1
};

exports.default = DepthType;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _DepthKit = {
  _versionMajor: 0,
  _versionMinor: 2,
  boundsCenter: {
    x: 0,
    y: 0,
    z: 1.03093326091766
  },
  boundsSize: {
    x: 3.14853119850159,
    y: 1.76878845691681,
    z: 1.08638906478882
  },
  crop: {
    w: 1.02883338928223,
    x: 0.186250150203705,
    y: -0.0672345161437988,
    z: 0.522190392017365
  },
  depthFocalLength: {
    x: 1919.83203125,
    y: 1922.28527832031
  },
  depthImageSize: {
    x: 3840.0,
    y: 2160.0
  },
  depthPrincipalPoint: {
    x: 1875.52282714844,
    y: 1030.56298828125
  },
  extrinsics: {
    e00: 1,
    e01: 0,
    e02: 0,
    e03: 0,
    e10: 0,
    e11: 1,
    e12: 0,
    e13: 0,
    e20: 0,
    e21: 0,
    e22: 1,
    e23: 0,
    e30: 0,
    e31: 0,
    e32: 0,
    e33: 1
  },
  farClip: 1.57412779331207,
  format: 'perpixel',
  nearClip: 0.487738698720932,
  numAngles: 1,
  textureHeight: 4096,
  textureWidth: 2048
};
var _RealSense = {
  _versionMajor: 0,
  _versionMinor: 2,
  boundsCenter: {
    x: 0,
    y: 0,
    z: 1.03093326091766
  },
  boundsSize: {
    x: 3.14853119850159,
    y: 1.76878845691681,
    z: 1.08638906478882
  },
  crop: {
    w: 1.02883338928223,
    x: 0.186250150203705,
    y: -0.0672345161437988,
    z: 0.522190392017365
  },
  depthFocalLength: {
    x: 1919,
    y: 1923
  },
  depthImageSize: {
    x: 3840.0,
    y: 2160.0
  },
  depthPrincipalPoint: {
    x: 1900.52282714844,
    y: 1030.56298828125
  },
  extrinsics: {
    e00: Math.cos(Math.PI),
    e01: 0,
    e02: Math.sin(Math.PI),
    e03: 0,
    e10: 0,
    e11: 1,
    e12: 0,
    e13: 0,
    e20: -Math.sin(Math.PI),
    e21: 0,
    e22: Math.cos(Math.PI),
    e23: 0,
    e30: 0,
    e31: 0,
    e32: 0,
    e33: 1
  },
  farClip: 2,
  format: 'perpixel',
  nearClip: 1,
  numAngles: 1,
  textureHeight: 4096,
  textureWidth: 2048
};

var Props = {
  DepthKit: _DepthKit,
  RealSense: _RealSense
};

exports.default = Props;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RenderStyle = {
  Mesh: 0,
  Points: 1,
  Wire: 2
};

exports.default = RenderStyle;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'checkWebGL',
    value: function checkWebGL() {
      var hasWebGL = void 0;
      window.WebGLRenderingContext ? hasWebGL = true : hasWebGL = false;
      return hasWebGL;
    }
  }, {
    key: 'isiOS',
    value: function isiOS() {
      return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      );
    }
  }, {
    key: 'isMobile',
    value: function isMobile() {
      var check = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    }
  }, {
    key: 'isJSON',
    value: function isJSON(json) {
      return json.description && json.description.match(/^{/);
    }
  }, {
    key: 'runDisplayHelpers',
    value: function runDisplayHelpers() {
      if (Vimeo.Util.isiOS()) {
        var iosEls = document.querySelectorAll('[data-is-ios]');
        for (var i = 0; i < iosEls.length; i++) {
          iosEls[i].style.display = 'block';
        }
      }

      if (!Vimeo.Util.isMobile()) {
        var els = document.querySelectorAll('[data-is-desktop]');
        for (var _i = 0; _i < els.length; _i++) {
          els[_i].style.display = 'block';
        }
      }
    }
  }]);

  return Util;
}();

exports.default = Util;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A promise based wrapper for the vimeo API
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// Utility wrapper with static methods needed for a rainy day 🌧


// Depth encoding types


var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _depthType = require('./depth-type');

var _depthType2 = _interopRequireDefault(_depthType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
  function API() {
    var quality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'auto';

    _classCallCheck(this, API);

    this.selectedQuality = quality;

    // Props to be parsed from the API response
    this.type;
    this.fps;
    this.props = {};
    this.url;
    this.files;
  }

  _createClass(API, [{
    key: 'requestVideo',
    value: function requestVideo(vimeoVideoID) {
      var _this = this;

      // Safeguard the request
      if (!vimeoVideoID) {
        console.warn('[Client] Can not request a video without providing a video ID');
        return;
      }

      // The function returns a promise based on the request made inside
      return new Promise(function (resolve, reject) {

        // Use the fetch API (returns a promise) and assemble the complete request path - e.g http://myawesomeapp.com/video/vimeo_video_id
        fetch('/video/' + vimeoVideoID).then(function (response) {

          // Unpack the response and get the object back using .json() method from the fetch API
          response.json().then(function (obj) {
            if (response.status === 200) {

              // Save the file list of each request to a member object of the instance
              if (obj.play == null) {
                reject('[Vimeo] No video file found');
              }

              _this.files = obj.play;

              // If a JSON was provided in the description then it's a DepthKit take (saved into this.props)
              if (_util2.default.isJSON(obj)) {
                _this.props = JSON.parse(obj.description);
                _this.type = _depthType2.default.DepthKit;
              } else {
                _this.props = null;
                _this.type = _depthType2.default.RealSense;
              }

              if (_this.selectedQuality === 'auto') {
                if (_util2.default.isiOS()) {

                  // Iterate over the files and look for a 720p version in progressive format
                  for (var file in _this.files.progressive) {
                    if (_this.files.progressive[file].width > 600 && _this.files.progressive[file].width < 1000) {
                      _this.selectedQuality = _this.files.progressive[file].width;
                    }
                  }

                  // this.selectedQuality = 'hls'; // Unfortunetly this will still result in an unsecure opreation on iOS so we can only play progressive files for now
                } else {
                  _this.selectedQuality = 'dash';
                }
                // TODO: if mobile safari, play hls
                // TODO: detect if stream even has dash/hls and fall back to highest progressive
                console.log('[Vimeo] Selected quality: ' + _this.selectedQuality);
              }

              if (_this.selectedQuality === 'hls') {
                if (_this.files.hls.link) {
                  _this.url = _this.files.hls.link;
                } else {
                  console.warn('[Vimeo] Requested an HLS stream but none was found');
                }
              } else if (_this.selectedQuality === 'dash') {
                if (_this.files.dash && _this.files.dash.link) {
                  _this.url = _this.files.dash.link;
                } else {
                  console.warn('[Vimeo] Requested a DASH stream but none was found');
                }
              } else {
                /*
                 * Progressive currently only supports DepthKit
                 * Future developments will support more native depth playback formats
                 * It is recomended to use adaptive format
                 */
                if (_this.type === _depthType2.default.DepthKit) {
                  // Iterate over the file list and find the one that matchs our quality setting (e.g 'hd')
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    for (var _iterator = _this.files.progressive[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var _file = _step.value;


                      if (_file.width === _this.selectedQuality) {

                        // Save the link
                        _this.url = _file.link;

                        // Save the framerate
                        _this.fps = _file.fps;

                        // If DepthKit in different resolutions then the ones specified in the JSON file
                        _this.props.textureWidth = _file.width;
                        _this.props.textureHeight = _file.height;
                      }
                    }
                  } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                      }
                    } finally {
                      if (_didIteratorError) {
                        throw _iteratorError;
                      }
                    }
                  }
                }
              }

              // Resolve the promise and return the url for the video and the props object
              resolve({
                url: _this.url,
                selectedQuality: _this.selectedQuality,
                props: _this.props,
                type: _this.type,
                fps: _this.fps
              });
            } else {
              reject(response.status);
            }
          });
        });
      });
    }
  }]);

  return API;
}();

exports.default = API;

},{"./depth-type":4,"./util":7}],9:[function(require,module,exports){
'use strict';

var _vimeo = require('./components/vimeo');

var _vimeo2 = _interopRequireDefault(_vimeo);

var _depthPlayer = require('./components/depth-player');

var _depthPlayer2 = _interopRequireDefault(_depthPlayer);

var _depthType = require('./components/depth-type');

var _depthType2 = _interopRequireDefault(_depthType);

var _renderStyle = require('./components/render-style');

var _renderStyle2 = _interopRequireDefault(_renderStyle);

var _util = require('./components/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
var Vimeo = {
  API: _vimeo2.default,
  DepthPlayer: _depthPlayer2.default,
  RenderStyle: _renderStyle2.default,
  DepthType: _depthType2.default,
  Util: _util2.default
};

if (window.THREE) {
  window.Vimeo = Vimeo;
} else {
  console.warn('[Depth Player] three.js was not found, did you forget to include it?');
}

},{"./components/depth-player":3,"./components/depth-type":4,"./components/render-style":6,"./components/util":7,"./components/vimeo":8}]},{},[9]);
