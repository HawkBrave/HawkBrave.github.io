// receives data from buffer
attribute vec2 a_pos;

varying vec4 v_color;

void main()
{
  gl_Position = vec4(a_pos, 0, 1);
  v_color = gl_Position * 0.5 + 0.5;
}