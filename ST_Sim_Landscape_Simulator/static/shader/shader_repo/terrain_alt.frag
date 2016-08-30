// terrain.frag
uniform float disp;
uniform float maxHeight;
uniform sampler2D heightmap;
uniform sampler2D rock;
uniform sampler2D snow;
uniform sampler2D grass;
uniform sampler2D sand;
uniform sampler2D water;
varying float vAmount;
varying vec2 vUV;

// lighting values
uniform vec3 lightPosition;
varying vec3 fN;
varying vec3 fE;
varying vec3 fL;


void main() {
	//vec4 water = (smoothstep(-0.01, 0.02, vAmount) - smoothstep(0.03, 0.04, vAmount)) * texture2D( water, vUV * 40.0);
	vec4 sand = (smoothstep(-0.01, 0.02, vAmount) - smoothstep(0.03, 0.04, vAmount)) * texture2D(sand, vUV * 20.0);
	vec4 grassy = (smoothstep(-0.05, 0.14, vAmount) - smoothstep(0.15, 0.50, vAmount)) * texture2D( grass, vUV * 30.0 );
	vec4 rocky  = (smoothstep(0.20, 0.40, vAmount) - smoothstep(0.45, 0.95, vAmount)) * texture2D( rock,  vUV * 20.0 );
	vec4 snowy  = (smoothstep(0.60, 0.85, vAmount))                                    * texture2D( snow,  vUV * 10.0 );
	
	vec4 color = vec4(0.0, 0.0, 0.0, 1.0) + sand + grassy + rocky + snowy;

   // Light colors all set to white at the moment
   vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);
   vec4 diffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
   vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);

   float intensity = 1.5;

   // These are really material properties and belong with each individual object but
   // for now we will lump them in here and they will apply to all objects.
   //ka = 0.2;
   float ka = 0.2;
   float kd = 1.0;
   float ks = 0.8;
   float shininess = 50.0;

   vec4 ambient_product = ka * intensity * ambientColor;
   vec4 diffuse_product = kd * intensity * diffuseColor;
   vec4 specular_product = ks * intensity * specularColor;

   // calculate calculate phong lighting
   vec3 N = normalize(fN);
   vec3 E = normalize(fE);
   vec3 L = normalize(fL);
   vec3 H = normalize(L + E);

   vec4 ambient = ambient_product*color;
   
   float diffDot = max(dot(L, N), 0.0);
   vec4 diffuse = diffDot*diffuse_product*color;
   
   float specDot = pow(max(dot(N, H), 0.0), shininess);
   vec4 specular = specDot*specular_product*color;
   
   // discard the specular highlight if the light's behind the vertex
   if( dot(L, N) < 0.0 ) {
      specular = vec4(0.0, 0.0, 0.0, 1.0);
   }
   
   vec4 finalColor = ambient + diffuse + specular;

   gl_FragColor = vec4(finalColor.rgb, 1.0);

   //gl_FragColor = color;

}