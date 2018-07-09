uniform float time;
uniform vec2 resolution;
uniform sampler2D map;

varying vec2 vUv;

const float  _Epsilon = .03;

// RGB to HSV
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + _Epsilon)), d / (q.x + _Epsilon), q.x);
}

void main()	{
  vUv = uv;

  vec2 depthUVS = vUv;
  depthUVS.y *= 0.5;

  vec4 perPointPos = vec4(position, 1.0);

  vec4 depthSample = texture2D(map, depthUVS);
  vec3 hsvDepthSample = rgb2hsv(depthSample.rgb);

  perPointPos.z += hsvDepthSample.x * 1.5;

  vec4 worldPos = projectionMatrix * modelViewMatrix * perPointPos;
  gl_Position = worldPos;

  gl_PointSize = 3.0;
}
