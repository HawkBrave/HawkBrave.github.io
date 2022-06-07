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

      // draw entire screen rect
      const data = new GLData([
       -1.0, -1.0,
        1.0, -1.0,  
        1.0,  1.0,
       -1.0,  1.0
      ]);

      this.glController = new GLController(this.context.gl, data);
      
      const vertexShaderSource = await this.dispatcher.load('shaders/vertex.glsl');
      const fragmentShaderSource = await this.dispatcher.load('shaders/fragment.glsl');

      this.glController.initialize(vertexShaderSource, fragmentShaderSource);


      

      this.display.load(this.canvas);
    }

    this.display.render();

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let maxiter = 100;
    for (let i = 1; i < maxiter; i++) {
      this.glController.draw(this.display.height, this.display.width, i);
      if (i < maxiter / 2) {
        await sleep(45);
      } else {
        await sleep(35);
      }
    }
    await sleep(50);
    for (let i = maxiter; i >= 0; i--) {
      this.glController.draw(this.display.height, this.display.width, i);
      await sleep(15);
    }
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