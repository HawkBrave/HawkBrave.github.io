attribute vec2 a_position;

varying vec3 v_color;

void main()
{
  gl_Position = vec4(a_position, 0, 1);
  v_color = gl_Position.xyz * 0.5 + 0.5;
}