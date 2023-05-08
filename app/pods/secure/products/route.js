import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProductsRoute extends BaseRoute {
  @service store;

  needs = ['read_products', 'read_product_families'];

  model() {
    return hash({
      products: this.store.findAll('product'),
      families: this.store.findAll('product-family')
    });
  }
}
