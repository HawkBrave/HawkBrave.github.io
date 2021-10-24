const canvas = document.querySelector('canvas');
const width = window.innerWidth; 
const height = window.innerHeight;

canvas.width = width; 
canvas.height = height;
const ctx = canvas.getContext('2d');

const realSet = {start: -3, end: 2};
const imaginarySet = {start: -1.5, end: 1.5};
const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`).sort();

let epoch = 3;
const grayscaleSet = false;

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

function content() {
  const content = document.querySelector('#content');
  content.style.opacity = '1';
}

let mbState = Array.from(Array(width), () => new Array(height));
mbState.forEach(r => r.forEach(z => z = {n: 0, re: 0, im: 0}));

async function render() {
  if (epoch >= 60) {
    window.cancelAnimationFrame(render);
    setTimeout(content, 1000);
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

function main() {
  canvas.style.opacity = 1;
  render();
  //content();
}

window.onload = main;