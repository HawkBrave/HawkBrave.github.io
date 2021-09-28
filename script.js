const canvas = document.querySelector('canvas');
const width = window.innerWidth; 
const height = window.innerHeight;

canvas.width = width; 
canvas.height = height;
const ctx = canvas.getContext('2d');

const realSet = {start: -3, end: 2};
const imaginarySet = {start: -1.5, end: 1.5};
const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`).sort();

let epoch = 2;
const grayscaleSet = false;


function mandelbrot(c) {
  let alpha = 1.0;
  let z = {re: 0, im: 0};
  for (let i = 0; i < epoch; i++) {
    let p = {
      re: Math.pow(z.re, 2) - Math.pow(z.im, 2),
      im: 2 * z.re * z.im
    }
    z.re = p.re + c.re;
    z.im = p.im + c.im;

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

function render() {
  if (epoch >= 50) {
    window.cancelAnimationFrame(render);
    //content();
    return;
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let c = {
        re: realSet.start + (i / width) * (realSet.end - realSet.start),
        im: imaginarySet.start + (j / height) * (imaginarySet.end - imaginarySet.start)
      }

      let alpha = mandelbrot(c);
      if (grayscaleSet) {
        let scale = (Math.abs(alpha - 1) * 255).toPrecision(3);
        ctx.fillStyle = `rgb(${scale}, ${scale}, ${scale})`;
      } else {
        ctx.fillStyle = colors[alpha === 1 ? 0 : parseInt(Math.pow(Math.tanh(alpha), 2) * 16)];
      }
      ctx.fillRect(i, j, 1, 1);
    }
  }
  epoch += 2;
  window.requestAnimationFrame(render);
}

function main() {
  render();
}

window.onload = main;