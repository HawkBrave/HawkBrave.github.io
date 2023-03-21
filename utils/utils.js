export default class Utils {
  static elname = null;

  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  static sleepUntilContextIsFree(context, effect, sitectx) {
    let current = sitectx.contentIdx;
    return new Promise(async r => {
      while (context.busy[effect]) {
        if (sitectx.contentIdx !== current) {
          return;
        }
        await Utils.sleep(1);
      }
      r();
    });
  }

  static async sleepUntilSiteCtxChanges(sitectx, ms) {
    let current = sitectx.contentIdx;
    for (let i = 0; i < ms; i++) {
      if (sitectx.contentIdx !== current) {
        return;
      }
      await this.sleep(1);
    }
  }

  static stringToHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html').body;
    return doc.firstChild;
  }

  static goBackTop() {
    let temp = document.body.style.height;
    document.body.style.height = '100vh';
    document.body.style.scrollBehavior = 'auto';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    document.body.style.height = temp;
    document.body.style.scrollBehavior = 'smooth';
  }

  static fade(element) {
    let op = 1;  // initial opacity
    const timer = setInterval(() => {
      if (op <= 0.1) {
        clearInterval(timer);
        element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ')';
      op -= op * 0.1;
    }, 50);
  }

  static unfade(element, context, speed=50, sitectx) {
    let current = sitectx.contentIdx;
    context.busy['unfade'] = true;
    let op = 0.1;
    element.style.opacity = op; // initial opacity
    const timer = setInterval(function() {
      if (op >= 1 || !element || sitectx.contentIdx !== current) {
        context.busy['unfade'] = false;
        clearInterval(timer);
        return;
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ')';
      op += op * 0.1;
    }, speed);
  }

  static moveFromDisposition(element, direction, start, end, context, speed=20, delay=10, sitectx) {
    let current = sitectx.contentIdx;
    if (Utils.elname !== null || !element) {
      return;
    }
    context.busy['move'] = true;
    Utils.elname = element.innerHTML;
    let pos = {x: start, y: start};
    let diff = (end - start);
    let i = 0;
    let velocity = 0;

    let timer = setInterval(() => {
      switch (direction) {
        case 'up':
          if (pos.y >= end || !element || sitectx.contentIdx !== current) {
            Utils.elname = null;
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          i++;
          if (i <= delay) {
            return;
          }
          element.style.bottom = `${pos.y}px`;
          velocity = diff * .1 + .1;
          pos.y += velocity;
          diff = end - pos.y;
          break;
        case 'down':
          if (pos.y <= end || !element || sitectx.contentIdx !== current) {
            Utils.elname = null;
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          i++;
          if (i <= delay) {
            return;
          }
          element.style.bottom = `${pos.y}px`;
          velocity = diff * .1 + .1;
          pos.y -= velocity;
          diff = -end + pos.y;
          break;
      }
    }, speed);
  }
}