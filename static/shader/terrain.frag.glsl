// terrain.frag

uniform sampler2D heightmap;
uniform sampler2D rock;
uniform sampler2D snow;
uniform sampler2D grass;
uniform sampler2D dirt;
uniform sampler2D sand;
uniform sampler2D water;

varying float vAmount;
varying vec2 vUV;

void main() {
	vec4 watery = (smoothstep(-0.1, 0.1, vAmount) - smoothstep(0.17, 0.21, vAmount)) * texture2D( water, vUV * 10.0 );
	vec4 sandy = (smoothstep(0.14, 0.27, vAmount) - smoothstep(0.28, 0.31, vAmount)) * texture2D( sand, vUV * 10.0 );
	vec4 grassy = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grass, vUV * 20.0 );
	vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rock, vUV * 20.0 );
	vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snow, vUV * 10.0 );
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + watery + sandy + grassy + rocky + snowy;
}