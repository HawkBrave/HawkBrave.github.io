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
      if (this.scrollIndicator) {
        return;
      }
      await Utils.sleep(2000);
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
      Utils.moveFromDisposition(this.scrollIndicator, 'up', -50, 80, this.context);
      Utils.unfade(this.scrollIndicator, this.context, 80)
      await Utils.sleepUntilContextIsFree(this.context, 'move');
      if (sitectx.contentIdx !== 0) {
        return;
      }
      Utils.moveFromDisposition(this.scrollIndicator, 'down', 80, -20, this.context, 30, 0);
    } else {
      this.scrollIndicator = null;
    }
  }

  getHeight = () => window.innerHeight;
  getWidth = () => window.innerWidth;
  getBodyHeight = () => document.body.clientHeight;
  getBodyWidth = () => document.body.clientWidth;
}