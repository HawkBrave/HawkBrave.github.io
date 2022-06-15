export default class Utils {
  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  static stringToHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/xml');
    console.log(doc.firstChild)
    return doc.firstChild;
  };

  static fade(element) {
    const op = 1;  // initial opacity
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
}