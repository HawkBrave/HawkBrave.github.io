export default class Dispatcher {
  /**
   * Fetches the file specified in the given path and returns its content as a string.
   * @param {string} filePath
   * @returns {Promise<string>} Content of the file.
   */
  async load(filePath) {
    let dat = null;
    try {
      let res = await fetch(`../${filePath}`);
      dat = await res.text();
    } catch (ex) {
      console.log(ex);
    }
    return dat;
  }
}