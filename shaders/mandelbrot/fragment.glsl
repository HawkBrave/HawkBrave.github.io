uniform int u_iterations;
uniform vec4 u_boundaries;
uniform vec2 u_screen;

varying vec3 v_color;

const int MAX_ITER = 10000;
const float BOUND = 16.0;

const int MAX_SAMPLING_RATE = 4096;


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

float mandelbrot_smooth(vec2 c)
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

  if (n < u_iterations) {
		return float(n) + 1.0 - log((log(z.x * z.x + z.y * z.y) / 2.0) / log(2.0)) / log(2.0);
	}

  return float(n);
}

float render(float x, float y)
{
  float width = u_screen.x;
  float height = u_screen.y;

  vec2 c = vec2(u_boundaries.x + x * (u_boundaries.y - u_boundaries.x) / (width), u_boundaries.z + y * (u_boundaries.w - u_boundaries.z) / (height));

  return mandelbrot_smooth(c);
}

float superSampling(float x, float y) {
  int samplingRate = 1;
	float change = 1.0 / (float(samplingRate) + 1.0);
	float m = 0.0;
	for (int i = 1; i < MAX_SAMPLING_RATE + 1; i++) {
		if (i > samplingRate) {
			break;
		}
		for (int j = 1; j < MAX_SAMPLING_RATE + 1; j++) {
			if (j > samplingRate) {
				break;
			}
			m = m + render(x + float(i) * change, y + float(j) * change);
		}
	}
	return m / float(samplingRate * samplingRate);
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

vec3 colored(float n)
{
  vec3 color = v_color - n / float(u_iterations);
  if (n < float(u_iterations)) {
    color = v_color - 0.5 + n / float(u_iterations);
  }
  return color;
}

vec3 hsvcolored(float n) {
	float hue = -(n + 40.0) / float(u_iterations);
	float saturation = 1.0;
	float value = n < float(u_iterations) ? 1.0 : 0.0;
	return hsv2rgb(vec3(hue, saturation, value));
}


void main()
{
  float x = gl_FragCoord.x - 0.5;
  float y = gl_FragCoord.y - 0.5;
  
  float p = render(x, y);
  vec3 color = hsvcolored(p);

  gl_FragColor = vec4(color, 1.0);
}