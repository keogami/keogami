#version 300 es
precision mediump float;

uniform vec2 u_resolution;

out vec4 outColor;

void main() {
    outColor = vec4(gl_FragCoord.xy / u_resolution, 0.0, 1.0); // Red color
}
