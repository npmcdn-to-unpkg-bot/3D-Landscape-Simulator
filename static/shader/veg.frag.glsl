// veg.frag

precision highp float;

uniform sampler2D tex;
uniform sampler2D heightmap;
uniform float maxHeight;
varying vec2 vUV;
varying float vAmount;

void main() {
    vec4 color = texture2D(tex, vUV); // use this to show ALL veg at all heights
    gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}