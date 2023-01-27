import Utils from '../utils/utils.js';

export default class GLAnimation {
  constructor(globject, frameCount) {
    this.globject = globject;
    this.frameCount = frameCount;
    this.currentFrame = 0;
  }

  hasNextFrame() {
    return this.currentFrame < this.frameCount;
  }

  async renderNextFrame() {
    if (this.currentFrame < this.frameCount / 2) {
      this.globject.render({iterations: ++this.globject.iterations});

      if (this.currentFrame < this.frameCount / 8) {
        await Utils.sleep(25);
      } else if (this.currentFrame < this.frameCount / 4) {
        await Utils.sleep(15);
      } else {
        //this.globject.render({boundaries: this.globject.boundaries.map(co => co * 1.00005)})
        await Utils.sleep(10);
      }

    } else if (this.currentFrame === this.frameCount / 2) {

      await Utils.sleep(1000);

    } else {
      this.globject.render({iterations: --this.globject.iterations});

      await Utils.sleep(5);
    }

    this.currentFrame++;
  }
}