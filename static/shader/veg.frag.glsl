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

void main() {
	if (vAmount <= vegMaxHeight && vAmount >= vegMinHeight) {
    	vec4 color = texture2D(tex, vUV);
    	if (color.a == 0.0) {  // if alpha is 0, discard
    		discard;
    	}
    	else {
            // blend the chosen color with the color of the texture
            color = vec4(color.r * vegColor.r, color.g * vegColor.g, color.b * vegColor.b, 1.0);
    		gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
    	    //gl_FragColor = vec4(vegColor.r, vegColor.g, vegColor.b, 1.0);
        }
	} else {
		discard;
	}
}