import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class CountriesRoute extends BaseRoute {
  needs = ['read_countries'];

  model() {
    return hash({
      companies: this.store.findAll('company'),
      countries: this.store.findAll('country'),
      markets: this.store.findAll('company-market')
    });
  }
}
