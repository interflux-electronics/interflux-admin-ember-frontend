import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class ImagesRoute extends BaseRoute {
  needs = ['read_images'];

  model() {
    return hash({
      images: this.store.findAll('image')
    });
  }

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('search', null);
      controller.set('category', null);
    }
  }
}
