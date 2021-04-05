import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProductController extends Controller {
  @service router;

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

  get sortedImages() {
    return this.model.family.productFamilyImages.sortBy('rankAmongImages');
  }

  get mainFamilyOptions() {
    const arr = this.model.families
      .filterBy('isMainFamily')
      .sortBy('rank')
      .map((family) => {
        return { value: family, label: family.namePlural };
      });

    arr.push({ value: null, label: 'none of the above' });

    return arr;
  }

  @action
  redirect(id) {
    this.router.transitionTo('secure.families.family', id);
  }
}
