precision mediump float;

uniform int u_iterations;
uniform vec4 u_boundaries;
uniform vec2 u_screen;

varying vec3 v_color;

// complex number operations
#define cx_add(a, b) vec2(a.x + b.x, a.y + b.y)
#define cx_sub(a, b) vec2(a.x - b.x, a.y - b.y)
#define cx_mul(a, b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define cx_div(a, b) vec2(((a.x*b.x + a.y*b.y)/(b.x*b.x + b.y*b.y)),((a.y*b.x - a.x*b.y)/(b.x*b.x + b.y*b.y)))

const int MAX_ITER = 100;
const float BOUND = 16.0;


float mandelbrot(vec2 c)
{
  vec2 z = vec2(0.0, 0.0);

  // for optimization purposes, instead of r = length(z) which uses sqrt, calculate r2
  float r2 = 0.0;
  int n = 0;

  for (int i = 0; i < MAX_ITER; i++) {
    z = cx_mul(z, z) + c;
    r2 = z.x*z.x + z.y*z.y;

    if (r2 > BOUND) break;

    n++;
    if (n >= u_iterations) break;
  }

  return float(n);
}


float render(float x, float y)
{
  float width = u_screen.x;
  float height = u_screen.y;

  vec2 c = vec2(u_boundaries.x + x * (u_boundaries.y - u_boundaries.x) / (width), u_boundaries.z + y * (u_boundaries.w - u_boundaries.z) / (height));
  return mandelbrot(c);
}


vec3 greyscale(float n)
{
  float color = 1.0 - n / float(u_iterations);
  if (n < float(u_iterations)) {
    color = 1.0 - (1.0 - n / float(u_iterations));
  }
  return vec3(color);
}


vec3 greyscale_reverse(float n)
{
  float color = 1.0 - (1.0 - n / float(u_iterations));
  if (n < float(u_iterations)) {
    color = 1.0 - n / float(u_iterations);
  }
  return vec3(color);
}

float sigmoid(float x, float startX, float endX) {
  if (x <= startX) return 0.0;
  else if (x >= endX) return 1.0;
  else {
    float scaledX = (x - startX) / (endX - startX);
    return 0.5 + scaledX * (1.0 - abs(scaledX) * 0.5);
  }
}

vec3 colored(float n)
{
  vec3 color = v_color - n / float(u_iterations);
  if (n < float(u_iterations)) {
    color = v_color - 0.5 + n / float(u_iterations);
  }
  return color;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 hsvcolored(float n) {
	float hue = n / -float(u_iterations);
	float saturation = 1.0;
	float value = n < float(u_iterations) ? 1.0 : 0.0;
	return hsv2rgb(vec3(hue, saturation, value));
}

void main()
{
  float x = gl_FragCoord.x - 0.5;
  float y = gl_FragCoord.y - 0.5;
  
  float p = render(x, y);
//  vec3 color = greyscale(p);
  vec3 color = hsvcolored(p);

  gl_FragColor = vec4(color, 1.0);
}