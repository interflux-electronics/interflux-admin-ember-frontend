import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class CountriesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      companies: this.store.findAll('company'),
      countries: this.store.findAll('country'),
      markets: this.store.findAll('company-market')
    });
  }
}
