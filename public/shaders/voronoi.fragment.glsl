#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
    outColor = vec4(gl_FragCoord.xy / vec2(1000, 1000), 0.0, 1.0); // Red color
}
