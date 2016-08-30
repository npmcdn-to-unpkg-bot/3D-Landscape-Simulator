// terrain.vert


uniform sampler2D heightmap;
uniform float maxHeight;
uniform float disp;
varying float vAmount;
varying vec2 vUV;

uniform vec3 lightPosition;
varying vec3 fN;
varying vec3 fE;
varying vec3 fL;


void main() 
{ 
    vUV = uv;
    
    vec4 heightInfo = texture2D( heightmap, uv );
    vAmount = heightInfo.r;
    float height = vAmount * maxHeight * disp;
    vec3 newPosition = vec3(position.x, height, position.z);
    //vec3 newPosition = position;
    //newPosition.y *= disp;
 	fN = normalize( modelViewMatrix * vec4(normal, 0.0)).xyz;
    fE = -(modelViewMatrix * vec4(newPosition, 1.0)).xyz;
    fL = lightPosition - (modelViewMatrix * vec4(newPosition, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}