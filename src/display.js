import Utils from "../utils/utils.js";

export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  load(node) {
    this.buffer = node;
  }

  // TODO: implement fading effect
  show() {
    this.container.replaceChild(this.buffer, this.container.children[0]);
    console.log(this.container);
    //Utils.fade(this.container.firstChild);
  }
}