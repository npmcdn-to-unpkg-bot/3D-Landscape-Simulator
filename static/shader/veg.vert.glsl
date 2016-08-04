// veg.vert

precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform sampler2D heightmap;
uniform float disp;
uniform float maxHeight;

attribute vec3 position;
attribute vec2 offset;
attribute vec2 hCoord;
attribute vec2 uv;    
attribute vec3 normal;
varying vec2 vUV;     
varying float vAmount;

// light uniforms
uniform vec3 light_position;

// light varyings
varying vec3 fN;
varying vec3 fE;
varying vec3 fL;

void main() {
    vUV = uv;

    vAmount = texture2D(heightmap, hCoord).r;
    vec3 newPosition = position + vec3(offset.x, vAmount * maxHeight * disp, offset.y);

    // implement phong lighting
    vec4 pos = vec4(newPosition,1.0);

    // use for light in eye position. This makes things stand out more when the user is looking directly at it.
    fN = normalize( modelViewMatrix*vec4(normal, 0.0) ).xyz;
    fE = -(modelViewMatrix*pos).xyz;
    fL = light_position - (modelViewMatrix*pos).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}