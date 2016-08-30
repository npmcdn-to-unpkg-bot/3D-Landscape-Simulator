// terrain.frag
//uniform float disp;
//uniform float maxHeight;
//uniform sampler2D heightmap;
//uniform sampler2D rock;
//uniform sampler2D snow;
//uniform sampler2D grass;
//uniform sampler2D sand;
//uniform sampler2D water;
//varying float vAmount;
//varying vec2 vUV;

varying vec4 finalColor;

void main() {
	//vec4 water = (smoothstep(-0.01, 0.02, vAmount) - smoothstep(0.03, 0.04, vAmount)) * texture2D( water, vUV * 40.0);
	//vec4 sand = (smoothstep(-0.01, 0.02, vAmount) - smoothstep(0.03, 0.04, vAmount)) * texture2D(sand, vUV * 20.0);
	//vec4 grassy = (smoothstep(-0.05, 0.14, vAmount) - smoothstep(0.15, 0.50, vAmount)) * texture2D( grass, vUV * 30.0 );
	//vec4 rocky  = (smoothstep(0.20, 0.40, vAmount) - smoothstep(0.45, 0.95, vAmount)) * texture2D( rock,  vUV * 20.0 );
	//vec4 snowy  = (smoothstep(0.60, 0.85, vAmount))                                    * texture2D( snow,  vUV * 10.0 );
	//gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water+ sand + grassy + rocky + snowy;
	//gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + sand + grassy + rocky + snowy;

	//gl_FragColor = vec4(finalColor, 1.0);
	gl_FragColor = finalColor;
}