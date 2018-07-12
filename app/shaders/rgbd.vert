uniform float mindepth;
uniform float maxdepth;

uniform float width;
uniform float height;

uniform bool isPoints;
uniform float pointSize;

uniform float time;

uniform vec2 focalLength;
uniform vec2 principalPoint;
uniform vec2 imageDimensions;
uniform vec4 crop;
uniform vec2 meshDensity;
uniform mat4 extrinsics;

varying vec3 vNormal;
varying vec3 vPos;

uniform sampler2D map;

varying float visibility;
varying vec2 vUv;

const float _DepthSaturationThreshhold = 0.5; //a given pixel whose saturation is less than half will be culled (old default was .5)
const float _DepthBrightnessThreshold = 0.5; //a given pixel whose brightness is less than half will be culled (old default was .9)
const float  _Epsilon = .03;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + _Epsilon)), d / (q.x + _Epsilon), q.x);
}

float depthForPoint(vec2 texturePoint)
{
    vec4 depthsample = texture2D(map, texturePoint);
    vec3 depthsamplehsv = rgb2hsv(depthsample.rgb);
    return depthsamplehsv.g > _DepthSaturationThreshhold && depthsamplehsv.b > _DepthBrightnessThreshold ? depthsamplehsv.r : 0.0;
}

void main() {
    vec4 texSize = vec4(1.0 / width, 1.0 / height, width, height);

    vec2 centerpix = texSize.xy * .5;
    vec2 textureStep = 1.0 / meshDensity;
    vec2 basetex = floor(position.xy * textureStep * texSize.zw) * texSize.xy;
    vec2 imageCoordinates = crop.xy + (basetex * crop.zw);
    basetex.y = 1.0 - basetex.y;

    vec2 depthTexCoord = basetex * vec2(1.0, 0.5) + centerpix;
    vec2 colorTexCoord = basetex * vec2(1.0, 0.5) + vec2(0.0, 0.5) + centerpix;

    vUv = colorTexCoord;
    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
    vNormal = normalMatrix * normal;

    //check neighbors
    //texture coords come in as [0.0 - 1.0] for this whole plane
    float depth = depthForPoint(depthTexCoord);

    float neighborDepths[8];
    neighborDepths[0] = depthForPoint(depthTexCoord + vec2(0.0,  textureStep.y));
    neighborDepths[1] = depthForPoint(depthTexCoord + vec2(textureStep.x, 0.0));
    neighborDepths[2] = depthForPoint(depthTexCoord + vec2(0.0, -textureStep.y));
    neighborDepths[3] = depthForPoint(depthTexCoord + vec2(-textureStep.x, 0.0));
    neighborDepths[4] = depthForPoint(depthTexCoord + vec2(-textureStep.x, -textureStep.y));
    neighborDepths[5] = depthForPoint(depthTexCoord + vec2(textureStep.x,  textureStep.y));
    neighborDepths[6] = depthForPoint(depthTexCoord + vec2(textureStep.x, -textureStep.y));
    neighborDepths[7] = depthForPoint(depthTexCoord + vec2(-textureStep.x,  textureStep.y));

    visibility = 1.0;
    int numDudNeighbors = 0;
    //search neighbor verts in order to see if we are near an edge
    //if so, clamp to the surface closest to us
    if (depth < _Epsilon || (1.0 - depth) < _Epsilon)
    {
        // float depthDif = 1.0;
        float nearestDepth = 1.0;
        for (int i = 0; i < 8; i++)
        {
            float depthNeighbor = neighborDepths[i];
            if (depthNeighbor >= _Epsilon && (1.0 - depthNeighbor) > _Epsilon)
            {
                // float thisDif = abs(nearestDepth - depthNeighbor);
                if (depthNeighbor < nearestDepth)
                {
                    // depthDif = thisDif;
                    nearestDepth = depthNeighbor;
                }
            }
            else
            {
                numDudNeighbors++;
            }
        }

        depth = nearestDepth;
        visibility = 0.8;

        // blob filter
        if (numDudNeighbors > 6)
        {
            visibility = 0.0;
        }
    }

    // internal edge filter
    float maxDisparity = 0.0;
    for (int i = 0; i < 8; i++)
    {
        float depthNeighbor = neighborDepths[i];
        if (depthNeighbor >= _Epsilon && (1.0 - depthNeighbor) > _Epsilon)
        {
            maxDisparity = max(maxDisparity, abs(depth - depthNeighbor));
        }
    }
    visibility *= 1.0 - maxDisparity;

    float z = (depth * (maxdepth - mindepth) + mindepth) * -1.0;
    vec4 worldPos = extrinsics * vec4((imageCoordinates * imageDimensions - principalPoint) * z / focalLength, z, 1.0);
    worldPos.w = 1.0;
    if(isPoints) gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * worldPos;
}
