import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class ImagesRoute extends BaseRoute {
  needs = ['read_images'];

  model() {
    return hash({
      images: this.store.findAll('image')
    });
  }
}
