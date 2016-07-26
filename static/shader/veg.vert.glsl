// veg.vert

precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform sampler2D heightmap;
uniform float disp;
uniform float maxHeight;
uniform float veg_scaler;

attribute vec3 position;
attribute vec2 offset;
attribute vec2 hCoord;
attribute vec2 uv;          // object uv coords
attribute vec3 normal;      // TODO - compute lighting? 
varying vec2 vUV;           // pass uv coords to fragment shader
varying float vAmount;

void main() {
    vUV = uv;

    vec4 heightInfo = texture2D(heightmap, hCoord);
    float height = heightInfo.r * maxHeight;
    vAmount = height;

    vec3 newPosition = position * veg_scaler;
    newPosition += vec3(offset.x, height * disp, offset.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}