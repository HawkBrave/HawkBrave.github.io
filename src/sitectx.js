export default class SiteCtx {
  /**
   * 
   * @param {number} contentIdx 
   * @param {WebGLRenderingContext} gl 
   */
  constructor(contentIdx, gl=null) {
    this.contentIdx = contentIdx;
    this.gl = gl;
  }
}