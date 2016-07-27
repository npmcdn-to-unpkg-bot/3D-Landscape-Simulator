// veg.frag

precision highp float;

uniform sampler2D tex;
uniform sampler2D heightmap;
uniform float maxHeight;

uniform float vegMaxHeight;
uniform float vegMinHeight;

varying vec2 vUV;
varying float vAmount;

void main() {
	if (vAmount <= vegMaxHeight && vAmount >= vegMinHeight) {
    	vec4 color = texture2D(tex, vUV);
    	if (color.r == 0.0) {
    		discard;
    	}
    	else {
    		gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
    	}
	} else {
		discard;
	}
}