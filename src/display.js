export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  load(node) {
    this.buffer = node;
  }

  show() {
    this.container.replaceChild(this.buffer, this.container.children[0]);
  }
}