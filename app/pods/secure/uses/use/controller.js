import Controller from '@ember/controller';

export default class UseController extends Controller {
  get use() {
    return this.model.use;
  }

  get imageCount() {
    if (!this.use.useImages) {
      return 0;
    }
    return this.use.useImages.length;
  }

  get maxAvatarCountReached() {
    return this.imageCount >= 4;
  }
}
