import GLData from './gldata.js';
import GLAnimation from './glanimation.js';


export default class GLController {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {GLData} globject
   */
  constructor(gl, globject) {
    this.gl = gl;
    this.globject = globject;
  }

  initialize() {
    this.globject.compile();

    let boundlist = [
      [ -2, 1, 
        -1, 1 ],
      [ -1.4883, -1.4683,
        -0.0065,  0.0065 ],
      [ -0.34853774148008254, -0.6065922085831237
        -0.34831493420245574, -0.606486596104741  ],
      [
        -1.4845855125, -1.4845773125,
        -0.0000032000,  0.0000032000
      ]
    ];

    let orientation = {
      width: this.gl.canvas.width,
      height: this.gl.canvas.height,
      rotate: false
    }

    if (orientation.height > orientation.width) {
      [orientation.height, orientation.width] = [orientation.width, orientation.height];
      orientation.rotate = true;
    }

    this.globject.setParameters({
      iterations: 10,
      boundaries: boundlist[1], 
      orientation
    });

    this.globject.initialize();

    this.animation = new GLAnimation(this.globject, 500);

    // clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  async draw() {
    // clear the canvas
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (;;) {
      if (!this.animation.hasNextFrame()) break;

      await this.animation.renderNextFrame(this.gl);

      // draw call
      const primitiveType = this.gl.TRIANGLE_FAN;
      const count = 4;
      const offset = 0;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }
}