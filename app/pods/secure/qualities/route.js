import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class QualitiesRoute extends BaseRoute {
  @service store;

  needs = ['read_qualities'];

  model() {
    return hash({
      qualities: this.store.findAll('quality'),
      products: this.store.findAll('product'),
      productQualities: this.store.findAll('product-quality')
    });
  }
}
