import GLData from './gldata.js';
import WebGLUtils from '../utils/webglutils-basic.js';

export default class Mandelbrot extends GLData {
  /**
   * @param {WebGLRenderingContext} gl
   */
  constructor(points, gl, vertexShader, fragmentShader) {
    super(points);
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.compiled = false;
    this.initialized = false;
    this.parametersReady = false;
  }

  setParameters({iterations, boundaries, orientation}) {
    let changed = false;

    if (typeof iterations !== 'undefined') {
      this.iterations = iterations;
      changed = true;
    }
    if (typeof boundaries !== 'undefined') {
      this.boundaries = boundaries;
      changed = true;
    }
    if (typeof orientation !== 'undefined') {
      this.orientation = orientation;
      changed = true;
    }

    if (this.iterations && this.boundaries &&
        this.orientation) this.parametersReady = true;
    return changed;
  }

  compile() {
    const vertexShader = WebGLUtils.compileShader(
        this.gl,
        this.vertexShader,
        this.gl.VERTEX_SHADER,
    );

    const fragmentShader = WebGLUtils.compileShader(
        this.gl,
        this.fragmentShader,
        this.gl.FRAGMENT_SHADER,
    );

    this.program = WebGLUtils.createProgram(this.gl, vertexShader,
        fragmentShader);

    this.compiled = true;
    return this.program;
  }

  initialize() {
    const pointsBuffer = this.gl.createBuffer();

    const positionAttribLocation = this.gl.getAttribLocation(this.program,
        'a_position');
    this.gl.enableVertexAttribArray(positionAttribLocation);

    // bind the buffer to ARRAY_BUFFER
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointsBuffer);

    // insert data into ARRAY_BUFFER
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.points, this.gl.STATIC_DRAW);

    // pair of shaders
    this.gl.useProgram(this.program);

    // specify how to use the vertex buffer
    const size = 2;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.vertexAttribPointer(
        positionAttribLocation,
        size,
        type,
        normalize,
        stride,
        offset,
    );

    this.iterationsUniformLocation = this.gl.getUniformLocation(this.program,
        'u_iterations');
    this.boundariesUniformLocation = this.gl.getUniformLocation(this.program,
        'u_boundaries');
    this.screenUniformLocation = this.gl.getUniformLocation(this.program,
        'u_screen');
    const rotationUniformLocation = this.gl.getUniformLocation(this.program,
        'u_rotation');
    this.gl.uniform1i(rotationUniformLocation, this.orientation.rotate);

    this.initialized = true;
  }

  _updateUniformValues() {
    this.gl.uniform1i(this.iterationsUniformLocation, this.iterations);
    this.gl.uniform4fv(this.boundariesUniformLocation, this.boundaries);
    this.gl.uniform2f(this.screenUniformLocation, this.orientation.width,
        this.orientation.height);
  }

  render(params) {
    if (!(this.compiled && this.initialized && this.parametersReady)) return;
    if (this.setParameters(params)) {
      this._updateUniformValues();
    }
  }
}