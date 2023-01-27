export default class GLData {
  /**
   *
   * @param {number[]} points Clip-space points
   */
  constructor(points) {
    this.points = new Float32Array(points);
  }
}