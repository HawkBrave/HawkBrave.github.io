import Utils from "../utils/utils.js";

export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.context = {busy: {unfade: false, move: false}};
  }

  /**
   * 
   * @param {HTMLElement} node 
   */
  load(node) {
    this.title = node.children.namedItem('section-title');
    this.node = node;
  }

  async show(fading) {
    if (this.title) {
      if (fading && !this.context.busy['unfade']) {
        Utils.unfade(this.title, this.context);
      }
      this.container.replaceChild(this.title, this.container.children[0]);
      await Utils.sleepUntilContextIsFree(this.context, 'unfade');
      await Utils.sleep(100);
      Utils.move(this.title, 'up', this.getHeight()/2, this.getHeight()/2 + 200, this.context);
      await Utils.sleepUntilContextIsFree(this.context, 'move');
    } 
    
    this.container.replaceChild(this.node, this.container.children[0]);
    
    if (fading && !this.context.busy['unfade']) {
      Utils.unfade(this.node.children.namedItem('section-body'), this.context);
    }
    if (this.title) {
      this.container.children[0].insertBefore(this.title, this.container.children[0].children[0]);
    }
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}