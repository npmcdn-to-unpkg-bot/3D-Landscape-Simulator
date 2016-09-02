// data_terrain.vert

uniform sampler2D heightmap;

varying vec2 vUV;

void main() 
{ 
    vUV = uv;
    float vAmount = texture2D(heightmap, uv).r;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}