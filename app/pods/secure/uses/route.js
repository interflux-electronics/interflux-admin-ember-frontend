import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProcessesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      uses: this.store.findAll('use'),
      products: this.store.findAll('product'),
      productUses: this.store.findAll('product-use')
    });
  }
}
