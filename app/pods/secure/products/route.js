import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProductsRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      products: this.store.findAll('product'),
      families: this.store.findAll('product-family')
    });
  }
}
