import GLData from './gldata.js';
import WebGLUtils from '../utils/webglutils-basic.js';


export default class GLController {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {GLData} data
   */
  constructor(gl, data) {
    this.gl = gl;
    this.data = data;
  }

  /**
   * 1. Get shaders
   * 2. Get program
   * 3. Get attribute locations
   * 4. Create points buffer
   * 5. Bind points buffer to ARRAY_BUFFER
   * 6. Insert point data to ARRAY_BUFFER
   */
  initialize(vertexShaderSource, fragmentShaderSource) {

    const vertexShader = WebGLUtils.compileShader(
      this.gl,
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    );

    const fragmentShader = WebGLUtils.compileShader(
      this.gl,
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    this.program = WebGLUtils.createProgram(this.gl, vertexShader, fragmentShader);

    // get the position where to insert data
    // vertex shader
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");

    // fragment shader
    this.iterationsUniformLocation = this.gl.getUniformLocation(this.program, "u_iterations");
    this.boundariesUniformLocation = this.gl.getUniformLocation(this.program, "u_boundaries");
    this.screenUniformLocation = this.gl.getUniformLocation(this.program, "u_screen");

    this.pointsBuffer = this.gl.createBuffer();

    // bind the buffer to ARRAY_BUFFER
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsBuffer);

    // insert data into ARRAY_BUFFER
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data.points), this.gl.STATIC_DRAW);

    // pair of shaders
    this.gl.useProgram(this.program);

    // turn on the attribute
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);

    // specify how to use the vertex buffer
    let size = 2;
    let type = this.gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  /**
   * 1. Resize canvas
   * 2. Clear canvas
   * 3. Create vertex pointer
   * 4. Draw call
   */
  draw(height, width, iterations) {
    // clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // clear the canvas
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    

    /*
    width = window.innerWidth;
    height = (400 / 600) * width;
  
    if (height > window.innerHeight) {
      width = (600 / 400) * window.innerHeight;
      height = window.innerHeight;
    }
    const off = [window.innerWidth - width, window.innerHeight - height];

    const boundries = [
      -2 - (off[0] / 2) * (3 / width),
      1 + (off[0] / 2) * (3 / width),
      -1 - (off[1] / 2) * (2 / height),
      1 + (off[1] / 2) * (2 / height),
    ];
    */
    const boundries = [-2, 1, -1, 1];
    this.gl.uniform1i(this.iterationsUniformLocation, iterations);
    this.gl.uniform4fv(this.boundariesUniformLocation, boundries);
    this.gl.uniform2f(this.screenUniformLocation, width, height);
    //---

    // draw call
    let primitiveType = this.gl.TRIANGLE_FAN;
    let count = 4;
    let offset = 0;
    this.gl.drawArrays(primitiveType, offset, count);
  }
}