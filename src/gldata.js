export default class GLData {
  /**
   * 
   * @param {number[]} points Clip-space points 
   */
  constructor(points) {
    /*
    // vertices for full-screen triangle (clip space)
    const vertices = [
      -1.0, -1.0,
       3.0, -1.0,
      -1.0,  3.0,
    ];
    */
    this.points = points;
  }
}