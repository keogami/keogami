#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 outColor;

// Plot a line on Y using a value between 0.0-1.0
// float plot(vec2 st) {
//     return smoothstep(0.02, 0.0, abs(st.y - st.x));
// }

void main() {
    float aspect_ratio = (u_resolution.x / u_resolution.y);
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= aspect_ratio;

    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= aspect_ratio;

    float radius = 0.2;

    vec2 point = vec2(0.3, 0.3);
    vec2 point2 = vec2(0.45, 0.45);

    float c = (1.0 / distance(st, point)) + (1.0 / distance(st, mouse)) + (1.0 / distance(st, point2));
    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.4, 0.05, 0.6), smoothstep(0.8, 1.0, c / 20.0));

    // float time_damper = 1.0 / 100.0;
    // float movement = 0.2 + cos(u_time * time_damper) * 0.1;

    // float diff = distance(st, m);

    // outColor = mix(vec4(0.4, 0.05, 0.6, 1.0), vec4(0.0, 0.0, 0.0, 1.0), smoothstep(0.05, movement, diff));

    outColor = vec4(color, 1.0);
}
