import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class CountriesRoute extends Route {
  @service store;

  model() {
    return hash({
      countries: this.store.findAll('country')
    });
  }
}
