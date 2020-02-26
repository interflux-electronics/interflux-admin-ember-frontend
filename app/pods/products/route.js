import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProductsRoute extends Route {
  @service store;

  model() {
    return hash({
      products: this.store.findAll('product'),
      productFamilies: this.store.findAll('product-family'),
      languages: this.store.findAll('language')
    });
  }
}
