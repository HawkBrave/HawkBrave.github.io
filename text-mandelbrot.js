let mandel = "";

(function textMandelbrot(epoch) {
  const f = (c) => {
    let z = {re: 0, im: 0};
    for (let i = 0; i < epoch; i++) {
      let p = {
        re: Math.pow(z.re, 2) - Math.pow(z.im, 2),
        im: 2 * z.re * z.im
      };
      z.re = p.re + c.re;
      z.im = p.im + c.im;
    }
    return Math.pow(z.re, 2) + Math.pow(z.im, 2) > 10;
  }

  for (let x = -40; x < 40; x++) {
    for (let y = -40; y < 60; y++) {
      if (f({re: y/30-1, im: x/30})) {
        mandel += '&nbsp;';
      } else {
        mandel += '*';
      }
    }
    mandel += '<br>';
  }
})(10);