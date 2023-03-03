import Utils from '../utils/utils.js';

export default class Display {
  constructor() {
    this.container = document.querySelector('#container');
    this.context = { busy: { unfade: false, move: false } };
  }

  /**
   * @param {HTMLElement} node
   */
  load(node) {
    this.title = node.children.namedItem('section-title');
    this.node = node;
  }

  // TODO fix this blasphemy of a function
  async show(sitectx, fading) {
    if (this.title) {
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
    if (sitectx.contentIdx === 0) {
      await Utils.sleep(3000);
      if (sitectx.contentIdx !== 0) {
        return;
      }
      let scrollIndicator = document.createElement('span');
      scrollIndicator.innerHTML = '>>>';
      scrollIndicator.style.position = 'absolute';
      scrollIndicator.style.transform = 'rotate(90deg) scale(1, 2)';
      scrollIndicator.style.bottom = '-50px';
      scrollIndicator.style.fontSize = '3vh';
      scrollIndicator.style.color = 'var(--site-gray)';
      if (sitectx.contentIdx !== 0) {
        return;
      }
      this.container.children[0].append(scrollIndicator);
      Utils.moveFromDisposition(scrollIndicator, 'up', -50, 80, this.context);
      Utils.unfade(scrollIndicator, this.context, 80)
      await Utils.sleepUntilContextIsFree(this.context, 'move');
      if (sitectx.contentIdx !== 0) {
        return;
      }
      Utils.moveFromDisposition(scrollIndicator, 'down', 80, -20, this.context, 30, 0);
    }
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}