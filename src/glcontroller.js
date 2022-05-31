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

    // get the position where to insert vertex data
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_pos");

    this.pointsBuffer = this.gl.createBuffer();

    // bind the buffer to ARRAY_BUFFER
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsBuffer);

    // insert data into ARRAY_BUFFER
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data.points), this.gl.STATIC_DRAW);
  }

  /**
   * 1. Resize canvas
   * 2. Clear canvas
   * 3. Create vertex pointer
   * 4. Draw call
   */
  draw() {
    // clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // clear the canvas
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

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

    // draw call
    let primitiveType = this.gl.TRIANGLES;
    let count = 3;
    this.gl.drawArrays(primitiveType, offset, count);
  }
}