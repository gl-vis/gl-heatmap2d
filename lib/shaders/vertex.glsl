precision mediump float;

attribute vec2 position;
attribute vec4 color;

uniform mat3 viewTransform;

varying vec4 fragColor;

void main() {
  vec3 vPosition = viewTransform * vec3(position, 1.0);
  fragColor = color;
  gl_Position = vec4(vPosition.xy, 0, vPosition.z);
}
