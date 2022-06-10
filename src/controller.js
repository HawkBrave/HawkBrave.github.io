import Utils from "../utils/utils.js";
import Dispatcher from "./dispatcher.js";
import Display from "./display.js";
import GLController from "./glcontroller.js";
import GLData from "./gldata.js";
import Mandelbrot from "./mandelbrot.js";

export default class Controller {
  /**
   * 
   * @param {Dispatcher} dispatcher 
   * @param {Display} display 
   */
  constructor(dispatcher, display) {
    this.dispatcher = dispatcher;
    this.display = display;
  }

  async setup() {
    this.canvas = this._initializeCanvas();
    this.context = this._initializeContext();

    if (this.context.pageIndex === 0
      && this.context.gl !== null) {

      const vertexShaderSource = await this.dispatcher.load('shaders/mandelbrot/vertex.glsl');
      const utilsShader = await this.dispatcher.load('shaders/utils.glsl');
      const fragmentShaderSource = await this.dispatcher.load('shaders/mandelbrot/fragment.glsl');
      // draw entire screen rect
      const mandelbrot = new Mandelbrot([
       -1.0, -1.0,
        1.0, -1.0,  
        1.0,  1.0,
       -1.0,  1.0
      ], this.context.gl, vertexShaderSource, utilsShader + fragmentShaderSource);

      this.glController = new GLController(this.context.gl, mandelbrot);

      this.glController.initialize();

      this.display.load(this.canvas);
    }
    this.display.show();

    await this.glController.draw();
  }

  _initializeCanvas() {
    const canvas = document.createElement('canvas');
    canvas.height = this.display.height;
    canvas.width = this.display.width;
    return canvas;
  }

  _initializeContext() {
    const context = {
      pageIndex: 1,
      gl: null
    };

    const glContext = this.canvas.getContext('webgl');
    if (glContext !== null) {
      context.pageIndex = 0;
      context.gl = glContext;
    }

    return context;
  }

  listen() {
    // TODO: handle scroll event
  }
}