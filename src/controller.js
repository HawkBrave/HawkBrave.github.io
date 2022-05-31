import Dispatcher from "./dispatcher.js";
import Display from "./display.js";
import GLController from "./glcontroller.js";
import GLData from "./gldata.js";

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

      const data = new GLData([
        -1.0, -1.0,
         3.0, -1.0,
        -1.0,  3.0,
      ]);
      this.glController = new GLController(this.context.gl, data);
      
      const vertexShaderSource = await this.dispatcher.load('shaders/vertex.glsl');
      const fragmentShaderSource = await this.dispatcher.load('shaders/fragment.glsl');

      this.glController.initialize(vertexShaderSource, fragmentShaderSource);
      this.glController.draw();

      this.display.load(this.canvas);
    }

    this.display.render();
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