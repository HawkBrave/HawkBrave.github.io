export default class Utils {

  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
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
    context.busy = true;
    let op = 0.1;
    element.style.opacity = op; // initial opacity
    const timer = setInterval(function () {
      if (op >= 1) {
        context.busy = false;
        clearInterval(timer);
        return;
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
    }, 50);
  }
}