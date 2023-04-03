import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class ProcessesRoute extends BaseRoute {
  needs = ['read_uses'];

  model() {
    return hash({
      uses: this.store.findAll('use'),
      products: this.store.findAll('product'),
      productUses: this.store.findAll('product-use')
    });
  }
}
