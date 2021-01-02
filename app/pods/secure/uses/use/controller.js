import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default class UseController extends Controller {
  @alias('model.use') use;

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
