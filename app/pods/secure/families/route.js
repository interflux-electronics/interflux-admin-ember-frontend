import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class FamiliesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      families: this.store.findAll('product-family')
    });
  }
}
