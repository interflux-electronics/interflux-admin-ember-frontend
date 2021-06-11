import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ImagesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      images: this.store.findAll('image')
    });
  }
}
