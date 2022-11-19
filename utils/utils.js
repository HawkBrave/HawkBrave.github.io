export default class Utils {

  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  static sleepUntilContextIsFree(context, effect) {
    return new Promise(async r => {
      while (context.busy[effect]) {
        await Utils.sleep(100);
      }
      r(); 
    });
  }

  static stringToHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html').body;
    return doc.firstChild;
  }

  static goBackTop() {
    let temp = document.body.style.height;
    document.body.style.height = '100vh';
    document.body.style.scrollBehavior = "auto";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    document.body.style.height = temp;
    document.body.style.scrollBehavior = "smooth";
  }

  static fade(element) {
    let op = 1;  // initial opacity
    const timer = setInterval(() => {
      if (op <= 0.1){
        clearInterval(timer);
        element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
    }, 50);
  }

  static unfade(element, context) {
    context.busy['unfade'] = true;
    let op = 0.1;
    element.style.opacity = op; // initial opacity
    const timer = setInterval(function () {
      if (op >= 1) {
        context.busy['unfade'] = false;
        clearInterval(timer);
        return;
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
    }, 50);
  }

  static move(element, direction, start=1, end, context) {
    context.busy['move'] = true;
    let diff = (end - start);
    let pos = {x: start - (diff * 0.1), y: start - (diff * 0.1)};
    let moveFunction;
    let i = 0;
    switch (direction.toLowerCase()) {
      case 'down':
        moveFunction = function () {
          if (pos.y >= end) {
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          element.style.top = `${pos.y}px`;
          pos.y += diff * 0.01 + i;
          i++;
        }
        break;
      case 'up':
      default:
        moveFunction = function () {
          if (pos.y >= end) {
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          element.style.bottom = `${pos.y}px`;
          pos.y += diff * 0.01 + i; 
          i++;
        }
        break;
      case 'left':
        moveFunction = function () {
          if (pos.x >= end) {
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          element.style.right = `${pos.x}px`;
          pos.x += diff * 0.01 + i;
          i++
        }
        break;
      case 'right':
        moveFunction = function () {
          if (pos.x >= end) {
            context.busy['move'] = false;
            clearInterval(timer);
            return;
          }
          element.style.left = `${pos.x}px`;
          pos.x *= diff * 0.01 + i;
          i++;
        }
        break;
    }
    const timer = setInterval(moveFunction, 20);
  }
}