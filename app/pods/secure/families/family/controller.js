import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default class ProductController extends Controller {
  @alias('model.family') family;

  get imageCount() {
    if (!this.family.productFamilyImages) {
      return 0;
    }
    return this.family.productFamilyImages.length;
  }

  get maxAvatarCountReached() {
    return this.imageCount >= 4;
  }
}
