import Controller from '@ember/controller';
// import { action } from '@ember/object';
// import { alias } from '@ember/object/computed';

export default class ImageController extends Controller {
  get image() {
    return this.model.image;
  }

  get showProducts() {
    return this.image.category === 'products';
  }

  get showProcesses() {
    return this.image.category === 'processes';
  }

  get showLabel() {
    return ['products', 'processes'].includes(this.image.category);
  }

  get showCopyright() {
    return ['products', 'processes'].includes(this.image.category);
  }
}
