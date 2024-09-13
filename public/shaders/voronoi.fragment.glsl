#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 outColor;

// Plot a line on Y using a value between 0.0-1.0
// float plot(vec2 st) {
//     return smoothstep(0.02, 0.0, abs(st.y - st.x));
// }

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 m = u_mouse / u_resolution;

    float diff = distance(st, m);

    vec4 color = mix(vec4(0.7, 0.1, 0.2, 1.0), vec4(0.4, 0.05, 0.6, 1.0), smoothstep(0.0, 0.7, diff));

    outColor = color;
}
