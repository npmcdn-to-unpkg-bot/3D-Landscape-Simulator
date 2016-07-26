// terrain.frag

uniform sampler2D heightmap;
uniform sampler2D tex;

varying float vAmount;
varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() 
{

    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vViewPosition);
    float dot = max( dot(normal, lightDir), 0.0);

    vec4 color = texture2D(tex, vUV) * 0.5;
    //gl_FragColor = vec4(color.rgb, 1.0) * dot;    // fake some lighting
    // debug
    vec4 heightColor = vec4(vAmount, vAmount, vAmount, 1.0) * 0.5;
    gl_FragColor = vec4(color.rgb + heightColor.rgb, 1.0);
}