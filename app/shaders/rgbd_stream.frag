uniform float time;
uniform vec2 resolution;
uniform sampler2D map;

varying vec2 vUv;
void main()	{
  vec2 colorUVS = vUv;

  //Cut the upper UV portion
  colorUVS.y *= 0.5;
  colorUVS.y += 0.5;

  //Sample the texture
  vec4 colorSample = texture2D(map, colorUVS);

  gl_FragColor = vec4(colorSample.rgb, 1.0);
}
