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
        Utils.unfade(this.title, this.context, undefined, sitectx);
      }

      await Utils.sleepUntilContextIsFree(this.context, 'unfade', sitectx);
      Utils.moveFromDisposition(this.title, 'up',
        titlePos - this.getHeight() / 2, 0, this.context, 20, 10, sitectx);
      await Utils.sleepUntilContextIsFree(this.context, 'move', sitectx);
    } else {
      this.container.replaceChild(this.node, this.container.children[0]);
    }

    if (fading && !this.context.busy['unfade'] && !this.context.busy['move']) {
      this.node.children.namedItem('section-body').style.visibility = 'visible';
      Utils.unfade(this.node.children.namedItem('section-body'), this.context, undefined, sitectx);
    }
    if (this.title) {
      this.container.children[0].insertBefore(this.title,
        this.container.children[0].children[0]);
    }
    if (sitectx.contentIdx === 0) {
      if (this.scrollIndicator) {
        return;
      }
      for (let i = 0; i < 500; i++) {
        await Utils.sleep(1);
        if (sitectx.contentIdx !== 0) {
          return;
        }
      }
      if (sitectx.contentIdx !== 0) {
        return;
      }
      
      this.scrollIndicator = document.createElement('span');
      this.scrollIndicator.innerHTML = '>>>';
      this.scrollIndicator.style.position = 'absolute';
      this.scrollIndicator.style.transform = 'rotate(90deg) scale(1, 2)';
      this.scrollIndicator.style.bottom = '-50px';
      this.scrollIndicator.style.fontSize = '3vh';
      this.scrollIndicator.style.color = 'var(--site-gray)';
      if (sitectx.contentIdx !== 0) {
        return;
      }
      this.container.children[0].append(this.scrollIndicator);
      Utils.moveFromDisposition(this.scrollIndicator, 'up', -50, 80, this.context, 20, 10, sitectx);
      Utils.unfade(this.scrollIndicator, this.context, 80, sitectx);
      await Utils.sleepUntilContextIsFree(this.context, 'move', sitectx);
      if (sitectx.contentIdx !== 0) {
        return;
      }
      Utils.moveFromDisposition(this.scrollIndicator, 'down', 80, -20, this.context, 30, 0, sitectx);
    } else {
      this.scrollIndicator = null;
    }
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}