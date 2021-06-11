import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class QualitiesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      qualities: this.store.findAll('quality'),
      products: this.store.findAll('product'),
      productQualities: this.store.findAll('product-quality')
    });
  }
}
