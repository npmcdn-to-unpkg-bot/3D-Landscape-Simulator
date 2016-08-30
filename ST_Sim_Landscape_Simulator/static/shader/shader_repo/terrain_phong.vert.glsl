// terrain.vert

// heightmap to get vertical amounts from
uniform sampler2D heightmap;

// texel varyings
varying float vAmount;
varying vec2 vUV;

// light varyings
varying vec3 fN;
varying vec3 fE;
varying vec3 fL;

void main() 
{ 
    vUV = uv;
    vAmount = texture2D(heightmap, uv).r;
    
    // vertical amount based on heightmap texture
    vec4 light_position  = vec4(0.0,1.0,-2.0,1);	// assumed in eye position
    
    vec4 pos = vec4(position, 1.0);
    fN = normalize( modelViewMatrix*vec4(normal, 0.0) ).xyz;
    fE = -(modelViewMatrix*pos).xyz;
    fL = light_position.xyz - (modelViewMatrix*pos).xyz;

        // set the position since we don't need to alter it
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}