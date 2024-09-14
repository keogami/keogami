#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 outColor;

vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float bezier(float p0, float p1, float p2, float t) {
    float u = 1.0 - t;
    return u * u * p0 + 2.0 * u * t * p1 + t * t * p2;
}

vec2 genPoint(float i) {
    float aspect_ratio = (u_resolution.x / u_resolution.y);
    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= aspect_ratio;

    float seed = u_time / 2000.0;
    vec2 offset = random2(i + vec2(1., 1.));
    vec2 offset2 = random2(i + vec2(1., 2.));
    vec2 offset3 = random2(i + vec2(2., 2.));
    vec2 offset4 = random2(i + vec2(2., 3.));
    vec2 offset5 = random2(i + vec2(4., 3.));
    vec2 offset6 = random2(i + vec2(3., 4.));

    float x = +0.15 + bezier(offset2.y * 0.3, offset3.x, offset5.y * 1.2, (sin(seed + offset.x) + 1.) * 0.5);
    float y = -0.05 + bezier(offset2.x * 0.3, offset4.y, offset6.x * 1.2, (tan(seed * 0.25 + offset.y) + 1.) * 0.5);
    return vec2(x, y);
}

void main() {
    float aspect_ratio = (u_resolution.x / u_resolution.y);
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= aspect_ratio;

    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= aspect_ratio;

    float c = 4. / distance(st, mouse);
    for (int i = 0; i < 30; i++) {
        c += (1. / distance(st, genPoint(float(i))));
    }

    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(77., 56., 92.) / 255., smoothstep(0.85, 0.9, c / 110.0));

    outColor = vec4(color, 1.0);
}
