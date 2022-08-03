import Controller from '@ember/controller';

export default class ImageController extends Controller {
  get image() {
    return this.model.image;
  }

  get showProducts() {
    return this.image.category === 'products';
  }

  get showPeople() {
    return this.image.category === 'people';
  }

  get showLabel() {
    return ['products', 'processes'].includes(this.image.category);
  }

  get showCopyright() {
    return ['products', 'processes'].includes(this.image.category);
  }
}
