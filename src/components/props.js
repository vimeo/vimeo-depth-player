const _DepthKit = {
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
}
const _RealSense = {
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
}

const Props = {
  DepthKit: _DepthKit,
  RealSense: _RealSense
}

export default Props
