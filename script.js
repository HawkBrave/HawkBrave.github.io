
const sleep = async duration => new Promise(resolve => setTimeout(resolve, duration));

function mandelbrot(c, z={n: 0, re: 0, im: 0}) {
  let alpha = 1.0;
  for (let i = z.n; i < epoch; i+=2) {
    let p = {
      re: Math.pow(z.re, 2) - Math.pow(z.im, 2),
      im: 2 * z.re * z.im
    };
    z.re = p.re + c.re;
    z.im = p.im + c.im;
    z.n++;

    if (Math.pow(z.re, 2) + Math.pow(z.im, 2) > 4) {
      alpha = parseFloat(i) / epoch;
      break;
    }
  }
  return alpha; 
}

function displayContent() {
  //canvas.style.display = 'none';
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.opacity = 0;
  const cont = document.querySelector('.content');
  cont.style.opacity = 1;
}

let mbState = Array.from(Array(window.width), () => new Array(window.height));
mbState.forEach(r => r.forEach(z => z = {n: 0, re: 0, im: 0}));

async function render() {
  if (epoch >= 60) {
    window.cancelAnimationFrame(render);
    setTimeout(displayContent, 1000);
    return;
  }

  for (let i = 0; i < width; i+=2) {
    for (let j = 0; j < height; j+=2) {
      let c = {
        re: realSet.start + (i / width) * (realSet.end - realSet.start),
        im: imaginarySet.start + (j / height) * (imaginarySet.end - imaginarySet.start)
      };

      let alpha = mandelbrot(c);

      if (grayscaleSet) {
        let scale = (Math.abs(alpha - 1) * 255).toPrecision(3);
        ctx.fillStyle = `rgb(${scale}, ${scale}, ${scale})`;
      } else {
        ctx.fillStyle = colors[alpha === 1 ? 0 : parseInt(Math.pow(Math.tanh(alpha), 2) * 16)];
      }
      ctx.fillRect(i, j, 2, 2);
    }
  }
  epoch += 2;
  await sleep(100);
  window.requestAnimationFrame(render);
}

function renderWithWebGL() {
  let source = `
  precision mediump float;

  uniform vec2 u_resolution;

  uniform vec2 u_zoomCenter;

  uniform float u_zoomSize;

  uniform int u_maxIterations;

  vec2 f(vec2 z, vec2 c) {
    return mat2(z, -z.y, z.z)*z + c;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    vec2 c = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);

    vec2 z = vec2(0.0);
    bool escaped = false;
    for (int i = 0; i < 10000; i++) {
      /* Unfortunately, GLES 2 doesn't allow non-constant expressions in loop
        conditions so we have to do this ugly thing instead. */
      if (i > u_maxIterations) break;
      z = f(z, c);
      if (length(z) > 2.0) {
        escaped = true;
        break;
      }
    }
    gl_FragColor = escaped ? vec4(vec3(float(iterations)) / float(u_maxIterations), 1.0) : vec4(vec3(0.0), 1.0);
  }
  `;
  let fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
  ctx.shaderSource(fragmentShader, source);
  ctx.compileShader(fragmentShader);
  let program = ctx.createProgram();
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  ctx.useProgram(program);
}

function webgl() { 
  try {
    let canvas = document.createElement('canvas'); 
    return !!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (ex) {
    return false;
  }
}

function init() {
  window.canvas = document.querySelector('canvas');
  window.width = window.innerWidth; 
  window.height = window.innerHeight;

  window.realSet = {start: -3, end: 2};
  window.imaginarySet = {start: -1.5, end: 1.5};
  window.colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`).sort();
  window.epoch = 3;
  window.grayscaleSet = false;

  canvas.width = width; 
  canvas.height = height;
  window.ctx = webgl();
  if (!ctx) {
    ctx = canvas.getContext('2d');
    return false;
  }
  return true;
}

function main() {
  window.debug = true;
  let glAccess = init();

  canvas.style.opacity = 1;
  if (window.debug) {
    displayContent();
  } else {
    if (glAccess) {
      renderWithWebGL();
    } else {
      render();
    }
  }
}

window.onload = main;