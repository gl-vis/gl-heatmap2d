precision mediump float;

varying float fragId;
varying vec2 vWeight;

uniform vec2 shape;
uniform vec4 pickOffset;

void main() {
  vec2 d = step(.5, vWeight);
  gl_FragColor = (vec4(fragId + d.x + d.y*shape.x, vec3(0.)) + pickOffset)/255.;
}
