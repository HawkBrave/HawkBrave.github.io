import Utils from '../utils/utils.js';

export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.context = {busy: {unfade: false, move: false}};
  }

  /**
   * @param {HTMLElement} node
   */
  load(node) {
    this.title = node.children.namedItem('section-title');
    this.node = node;
  }

  async show(fading) {
    if (this.title) {
      //this.container.replaceChild(this.title, this.container.children[0]);
      this.node.children.namedItem('section-body').style.visibility = 'hidden';
      this.title.style.visibility = 'hidden';
      this.container.replaceChild(this.node, this.container.children[0]);
      let titlePos = this.title.getBoundingClientRect().y;
      this.title.style.bottom = `${titlePos - this.getHeight() / 2}px`;
      this.title.style.visibility = 'visible';

      if (fading && !this.context.busy['unfade']) {
        Utils.unfade(this.title, this.context);
      }

      await Utils.sleepUntilContextIsFree(this.context, 'unfade');
      await Utils.sleep(100);
      Utils.moveFromDisposition(this.title, 'up',
          titlePos - this.getHeight() / 2, 0, this.context);
      await Utils.sleepUntilContextIsFree(this.context, 'move');
    } else {
      this.container.replaceChild(this.node, this.container.children[0]);
    }

    if (fading && !this.context.busy['unfade'] && !this.context.busy['move']) {
      this.node.children.namedItem('section-body').style.visibility = 'visible';
      Utils.unfade(this.node.children.namedItem('section-body'), this.context);
    }
    if (this.title) {
      this.container.children[0].insertBefore(this.title,
          this.container.children[0].children[0]);
    }
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}