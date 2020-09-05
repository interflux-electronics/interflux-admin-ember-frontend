import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class FamiliesRoute extends Route {
  @service store;

  model() {
    return hash({
      families: this.store.findAll('product-family')
    });
  }
}
