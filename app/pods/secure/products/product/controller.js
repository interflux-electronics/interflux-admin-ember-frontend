import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class SecureProductsProductController extends Controller {
  @alias('model.product') product;

  get publicImages() {
    return this.product.productImages.filterBy('public', true).sortBy('rank');
  }

  get hiddenImages() {
    return this.product.productImages.rejectBy('public', true);
  }

  get publicImageCount() {
    return this.publicImages.length;
  }

  @action
  showImage(rel) {
    rel.rank = 999;
    rel.public = true;
    this.redoRanks();
  }

  @action
  hideImage(rel) {
    rel.public = false;
    rel.rank = 0;
    this.redoRanks();
  }

  @action
  moveImageUp(rel) {
    rel.rank = rel.rank - 1.5; // subtracting 1.5 sorts this image between -1 and -2
    this.redoRanks();
  }

  @action
  moveImageDown(rel) {
    rel.rank = rel.rank + 1.5; // adding 1.5 sorts this image between +1 and +2
    this.redoRanks();
  }

  @action
  setAvatar(rel) {
    rel.rank = 0.5;
    this.product.image = rel.image;
    this.redoRanks();
    this.product.save({
      adapterOptions: {
        whitelist: 'image'
      }
    });
  }

  redoRanks() {
    this.publicImages.forEach((relation, i) => {
      relation.rank = i + 1;
    });
    this.saveDirtyImages();
  }

  saveDirtyImages() {
    const dirtyImages = this.product.productImages.filterBy(
      'hasDirtyAttributes',
      true
    );

    dirtyImages.forEach((relation) => {
      relation.save();
    });
  }
}
