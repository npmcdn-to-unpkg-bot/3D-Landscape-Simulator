// data_terrain.frag

uniform sampler2D tex;
uniform sampler2D heightmap;

varying vec2 vUV;

void main() {
    vec4 hcolor = texture2D(heightmap, vUV);
    vec4 sc_color = texture2D(tex, vUV);
    if (sc_color.rgb == vec3(0.)) discard;
    // gl_FragColor = mix(hcolor, sc_color, 1.0);
    gl_FragColor = hcolor;
}