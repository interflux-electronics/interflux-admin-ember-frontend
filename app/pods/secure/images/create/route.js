import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class ImageCreateRoute extends ModalRoute {
  model() {
    return hash({
      image: this.store.createRecord('image')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('image')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.setProperties({
        subject: null,
        product: null,
        products: null,
        loadingProducts: true,
        loadingProductImages: true,
        file: null,
        extension: null,
        localImageURL: null,
        width: null,
        height: null,
        n: null,
        cdnBasePath: null,
        uploadCommenced: false,
        uploadError: false,
        uploadSuccess: false,
        conversionProgress: 0,
        conversionError: false,
        conversionSuccess: false,
        image: null
      });
    }
  }
}
