// veg.frag

precision highp float;

uniform sampler2D tex;
uniform sampler2D sc_tex;
//uniform sampler2D heightmap;
//uniform float maxHeight;
//uniform vec3 vegColor;

//uniform float opacity;
//uniform float veg_opacity;

//uniform float vegMaxHeight;
//uniform float vegMinHeight;

varying vec2 vUV;
varying vec2 scUV;
//varying float vAmount;

// light color uniforms
//uniform vec3 ambientProduct;
//uniform vec3 diffuseProduct;
//uniform float diffuseScale;
//uniform vec3 specularProduct;
//uniform float shininess;
//
//// light varyings
//varying vec3 fN;
//varying vec3 fE;
//varying vec3 fL;
//varying vec3 negfN;


void main() {

    //float vegHeight = vAmount * maxHeight;
//
	//if (vegHeight <= vegMaxHeight && vegHeight > vegMinHeight) {
    //	vec4 myColor = texture2D(tex, vUV);
    //	if (myColor.a <= 0.3) {  // if alpha is 0, discard
    //		discard;
    //	}
    //	else {
//
    //        // blend the chosen color with the color of the texture
    //        myColor = vec4(myColor.r * vegColor.r + 0.1, myColor.g * vegColor.g + 0.1, myColor.b * vegColor.b + 0.1, 1.0);
    //		
    //        // compute lighting
    //        vec3 N = gl_FrontFacing ? normalize(fN) : normalize(negfN);
    //        //vec3 N = gl_Front
    //        vec3 E = normalize(fE);
    //        vec3 L = normalize(fL);
    //    
    //        vec3 H = normalize( L + E );
    //    
    //        vec4 ambient = vec4(ambientProduct, 1.0)*myColor;
    //    
    //        float diffDot = max(dot(L, N), diffuseScale);
    //        vec4 diffuse = diffDot*vec4(diffuseProduct, 1.0)*myColor;
    //    
    //        float specDot = pow(max(dot(N, H), 0.0), shininess);
    //        vec4 specular = specDot*vec4(specularProduct, 1.0)*myColor;
    //    
    //        // discard the specular highlight if the light's behind the vertex
    //        if( dot(L, N) < 0.0 ) {
    //           specular = vec4(0.0, 0.0, 0.0, 1.0);
    //        }
    //    
    //        vec4 finalColor = ambient + diffuse + specular;
    //        finalColor.a = 1.0;
    //        gl_FragColor = finalColor;
    //    }
	//} else {
	//	discard;
	//}
    vec4 tex_color = texture2D(tex, vUV);
    vec4 sc_color = texture2D(sc_tex, scUV);

    //float opacity_actual = min(opacity, veg_opacity);

    if (tex_color.a <= 0.3) {
        discard;
    } else {
        //vec3 final_color = tex_color.rgb * sc_color.rgb;
        //gl_FragColor = vec4(final_color, 1.0);
        gl_FragColor = vec4(sc_color.rgb * normalize((tex_color.rgb * .2)), 1.0);
        //gl_FragColor = vec4(sc_color.rgb * normalize((tex_color.rgb * .2)), opacity_actual);
        //gl_FragColor = vec4(sc_color.rgb * normalize((tex_color.rgb * .2)), opacity);
        //gl_FragColor = vec4(sc_color.rgb * normalize((tex_color.rgb * .2)), veg_opacity);
    }
}