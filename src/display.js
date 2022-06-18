import Utils from "../utils/utils.js";

export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.context = {busy: false};
  }

  load(node) {
    this.buffer = node;
  }

  show(fading) {
    if (fading && !this.context.busy) {
      Utils.unfade(this.container, this.context);
    }
    this.container.replaceChild(this.buffer, this.container.children[0]);
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}