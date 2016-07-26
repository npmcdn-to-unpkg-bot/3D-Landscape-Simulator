// terrain.vert


uniform sampler2D heightmap;
uniform float maxHeight;
uniform float disp;
varying float vAmount;
varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() 
{ 
    vUV = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 heightInfo = texture2D( heightmap, uv );
    vAmount = heightInfo.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
    vec3 newPosition = vec3(position.x, vAmount * maxHeight * disp, position.z);
 
    vec4 mvPos = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPos.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}