// terrain.vert


uniform sampler2D heightmap;
uniform float maxHeight;
uniform float disp;
varying float vAmount;
varying vec2 vUV;

void main() 
{ 
    vUV = uv;
    
    vec4 heightInfo = texture2D( heightmap, uv );
    vAmount = heightInfo.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
    vec3 newPosition = vec3(position.x, vAmount * maxHeight * disp, position.z);
 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}