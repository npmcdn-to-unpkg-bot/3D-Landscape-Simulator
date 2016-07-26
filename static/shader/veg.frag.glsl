// veg.frag

precision highp float;

uniform sampler2D tex;
uniform sampler2D heightmap;
uniform float maxHeight;
uniform int low_or_high;
varying vec2 vUV;
varying float vAmount;

void main() {
   //if (low_or_high > 0) {
   //    if (vAmount < maxHeight / 2.5) {
   //        discard;
   //    }
   //} else {
   //    if (vAmount > maxHeight / 2.5) {
   //        discard;
   //    }
   //    else {
   //        vec4 color = texture2D(tex, vUV);

   //        gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
   ////gl_FragColor = vec4(1.0);
   //    }
   //}

    vec4 color = texture2D(tex, vUV); // use this to show ALL veg at all heights
    gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}