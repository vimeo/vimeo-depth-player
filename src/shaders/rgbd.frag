uniform sampler2D map;
uniform float opacity;

uniform float uvdy;
uniform float uvdx;

varying float visibility;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {

    if ( visibility < 0.9 ) discard;
    vec4 color = texture2D(map, vUv);

    //For live streaming only to clip the black per pixel
    if(PIXEL_EDGE_CLIP == 1){
      if( color.r < 0.05 ) discard;
    }

    color.w = opacity;

    gl_FragColor = color;

}
