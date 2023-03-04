import Utils from '../utils/utils.js';
import Dispatcher from './dispatcher.js';
import Display from './display.js';
import GLController from './glcontroller.js';
import Mandelbrot from './mandelbrot.js';
import SiteCtx from './sitectx.js';

export default class Controller {
  /**
   *
   * @param {Dispatcher} dispatcher
   * @param {Display} display
   */
  constructor(dispatcher, display) {
    this.dispatcher = dispatcher;
    this.display = display;

    this.canvas = this._initializeCanvas();
    this.context = this._initializeContext();
  }

  async setup() {
    if (this.context.contentIdx === -1
        && this.context.gl !== null) {

      const vertexShaderSource = await this.dispatcher.load(
          'shaders/mandelbrot/vertex.glsl');
      const utilsShader = await this.dispatcher.load('shaders/utils.glsl');
      const fragmentShaderSource = await this.dispatcher.load(
          'shaders/mandelbrot/fragment.glsl');
      // draw entire screen rect
      const mandelbrot = new Mandelbrot([
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0,
          ], this.context.gl, vertexShaderSource,
          utilsShader + fragmentShaderSource);

      this.glController = new GLController(this.context.gl, mandelbrot);

      this.glController.initialize();

      this.display.load(this.canvas);
      this.display.show(this.context, false);

      await this.glController.draw();

      this.context.contentIdx = 0;
    }

    const payload = await this.dispatcher.loadFromContext(this.context);
    // TODO: make webpage long (scrollable)
    document.body.style.height = `${this.dispatcher.fileDict.length * 100}vh`;

    this.display.load(Utils.stringToHTML(payload));
    await this.display.show(this.context, true);
  }

  _initializeCanvas() {
    const canvas = document.createElement('canvas');
    canvas.height = this.display.getHeight();
    canvas.width = this.display.getWidth();
    return canvas;
  }

  _initializeContext() {
    const context = new SiteCtx(0);

    const glContext = this.canvas.getContext('webgl');
    if (glContext !== null) {
      context.contentIdx = -1;
      context.gl = glContext;
    }

    return context;
  }

  listen() {
    let contentLength = this.dispatcher.fileDict.length;
    let pixelsPerSection = this.display.getBodyHeight() / contentLength;

    addEventListener('scroll', async event => {
      let scrollWithBoundaries = scrollY + window.innerHeight / 2 <= 0 ?
          1 :
          scrollY + window.innerHeight / 2;
      scrollWithBoundaries = scrollWithBoundaries >=
      document.body.clientHeight ?
          document.body.clientHeight :
          scrollWithBoundaries;

      let pos = (scrollWithBoundaries / pixelsPerSection) >= contentLength ?
          contentLength - 1 :
          Math.floor(scrollWithBoundaries / pixelsPerSection);

      if (this.context.contentIdx !== pos) {
        this.context.contentIdx = pos;
        const payload = await this.dispatcher.loadFromContext(this.context);
        this.display.load(Utils.stringToHTML(payload));
        await this.display.show(this.context, true);
      }
    });
  }
}