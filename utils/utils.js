export default class Utils {
  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}