import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class CompaniesRoute extends Route {
  @service store;

  model() {
    return hash({
      companies: this.store.findAll('company'),
      countries: this.store.findAll('country')
    });
  }
}
