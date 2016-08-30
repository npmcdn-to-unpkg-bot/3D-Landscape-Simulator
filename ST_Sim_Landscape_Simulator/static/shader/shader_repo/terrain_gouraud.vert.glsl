// terrain.vert


uniform sampler2D heightmap;
uniform sampler2D rock;
uniform sampler2D snow;
uniform sampler2D grass;
uniform sampler2D sand;
uniform sampler2D water;

//varying float vAmount;
//varying vec2 vUV;

varying vec4 finalColor;

void main() 
{ 
    //vUV = uv;
    //vAmount = texture2D(heightmap, uv).r;
    
    // vertical amount based on heightmap texture
    float vAmount = texture2D(heightmap, uv).r;
	vec4 sand = (smoothstep(-0.01, 0.02, vAmount) - smoothstep(0.03, 0.04, vAmount)) * texture2D(sand, uv * 20.0);
	vec4 grassy = (smoothstep(-0.05, 0.14, vAmount) - smoothstep(0.15, 0.50, vAmount)) * texture2D( grass, uv * 30.0 );
	vec4 rocky  = (smoothstep(0.20, 0.40, vAmount) - smoothstep(0.45, 0.95, vAmount)) * texture2D( rock,  uv * 20.0 );
	vec4 snowy  = (smoothstep(0.60, 0.85, vAmount))                                    * texture2D( snow,  uv * 10.0 );
	vec4 myColor =  vec4(0.0, 0.0, 0.0, 1.0) + sand + grassy + rocky + snowy;

    vec4 light_position  = vec4(2.0,1.0,-2.0,1);	// assumed in eye position
    vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);	
    vec4 diffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);

    float intensity = 1.0;

    // These are really material properties and belong with each individual object but
    // for now we will lump them in here and they will apply to all objects.
    //ka = 0.2;
    float ka = 0.4;
    float kd = 1.0;
    float ks = 0.8;
    float shininess = 50.0;

	// unused, but useful for debugging
	vec4 ambient_product = ka * intensity * ambientColor;
	vec4 diffuse_product = kd * intensity * diffuseColor;
	vec4 specular_product = ks * intensity * specularColor;

    //vec4 ambient_product = ka * intensity * myColor;
    //vec4 diffuse_product = kd * intensity * myColor;
    //vec4 specular_product = ks * intensity * myColor;

    // calculate the color
    // Transform vertex  position into eye coordinates
    vec3 pos = (modelViewMatrix * vec4(position, 1.0)).xyz;

    // These are parameters we need for the Phong Lighting model:  V, R, N, L. Here, the variable E represents V, and H is R
    // This assumes the light position is passed into the shader in eye coordinates
    vec3 L = normalize( (light_position).xyz - pos );  // Light direction
    vec3 E = normalize( -pos );    //  V = View direction: camera sits at the origin so "eye" direction is: origin-pos = -pos
    vec3 H = normalize( L + E );   // R = Reflected direction: this formula is an approximation of R.

    // Transform vertex normal into eye coordinates
    // Be careful - generally the normals transform slightly differently than the vertices
    // however, for rotations and uniform scale, they are the same.
    // We will have to be more careful when doing non-uniform scales.
    vec3 N = normalize( modelViewMatrix*vec4(normal, 0.0) ).xyz;

    // Compute terms in the illumination equation
   vec4 ambient = ambient_product*myColor;   // Ka*LightColor*SurfaceColor

    float LN = max( dot(L, N), 0.0 ); // LdotN < 0, then there is no diffuse

    vec4  diffuse = LN*diffuse_product*myColor; // kd*(NdotL)*LightColor*SurfaceColor

    float NH = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = NH * specular_product*myColor;

    if( dot(L, N) < 0.0 ) {                  // specular is also 0 if LdotN<0
	   specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    finalColor =  ambient + diffuse + specular;

    finalColor.a = 1.0;  // set alpha channel of color to be 1

        // set the position since we don't need to alter it
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}