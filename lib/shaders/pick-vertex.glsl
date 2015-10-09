precision mediump float;

attribute vec2 position;
attribute vec4 pickId;

uniform mat3 viewTransform;
uniform vec4 pickOffset;

varying vec4 fragId;

void main() {
  vec4 id = pickId + pickOffset;
  id.y += floor(id.x / 256.0);
  id.x -= floor(id.x / 256.0) * 256.0;

  id.z += floor(id.y / 256.0);
  id.y -= floor(id.y / 256.0) * 256.0;

  id.w += floor(id.z / 256.0);
  id.z -= floor(id.z / 256.0) * 256.0;

  fragId = id / 255.0;

  vec3 vPosition = viewTransform * vec3(position, 1.0);
  gl_Position = vec4(vPosition.xy, 0, vPosition.z);
}
