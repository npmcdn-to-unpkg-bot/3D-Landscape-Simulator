// veg.frag

precision highp float;

uniform sampler2D tex;
uniform sampler2D heightmap;
uniform float maxHeight;
uniform vec3 vegColor;

uniform float vegMaxHeight;
uniform float vegMinHeight;

varying vec2 vUV;
varying float vAmount;

// light color uniforms
uniform vec3 ambientProduct;
uniform vec3 diffuseProduct;
uniform vec3 specularProduct;
uniform float shininess;

// light varyings
varying vec3 fN;
varying vec3 fE;
varying vec3 fL;


void main() {

    // compute lighting constants - TODO - import these as uniforms from the program
    //vec4 ambientColor = vec4(1.0, 1.0, 1.0, 1.0);   
    //vec4 diffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
    //vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);

    //vloat intensity = 1.0;

    //v/ These are really material properties and belong with each individual object but
    //v/ for now we will lump them in here and they will apply to all objects.
    //vloat ka = 0.63;
    //vloat kd = 1.0;
    //vloat ks = 0.2;
    //vloat shininess = 20.0;

    //vec4 ambient_product = ka * intensity * ambientColor;
    //vec4 diffuse_product = kd * intensity * diffuseColor;
    //vec4 specular_product = ks * intensity * specularColor;

    float vegHeight = vAmount * maxHeight;

	if (vegHeight <= vegMaxHeight && vegHeight > vegMinHeight) {
    	vec4 myColor = texture2D(tex, vUV);
    	if (myColor.a == 0.0) {  // if alpha is 0, discard
    		discard;
    	}
    	else {

            // blend the chosen color with the color of the texture
            myColor = vec4(myColor.r * vegColor.r + 0.1, myColor.g * vegColor.g + 0.1, myColor.b * vegColor.b + 0.1, 1.0);
    		
            // compute lighting
            vec3 N = normalize(fN);
            vec3 E = normalize(fE);
            vec3 L = normalize(fL);
        
            vec3 H = normalize( L + E );
        
            vec4 ambient = vec4(ambientProduct, 1.0)*myColor;
        
            float diffDot = max(dot(L, N), 0.0);
            vec4 diffuse = diffDot*vec4(diffuseProduct, 1.0)*myColor;
        
            float specDot = pow(max(dot(N, H), 0.0), shininess);
            vec4 specular = specDot*vec4(specularProduct, 1.0)*myColor;
        
            // discard the specular highlight if the light's behind the vertex
            if( dot(L, N) < 0.0 ) {
               specular = vec4(0.0, 0.0, 0.0, 1.0);
            }
        
            vec4 finalColor = ambient + diffuse + specular;
            finalColor.a = 1.0;
            gl_FragColor = finalColor;
        }
	} else {
		discard;
	}
}