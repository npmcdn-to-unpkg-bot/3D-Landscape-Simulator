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
    vAmount = heightInfo.r;
    float height = vAmount * maxHeight * disp;
    vec3 newPosition = vec3(position.x, height, position.z);
 	
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}