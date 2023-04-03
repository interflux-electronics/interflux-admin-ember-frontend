import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class CompaniesRoute extends BaseRoute {
  needs = ['read_companies', 'read_company_markets'];

  model() {
    return hash({
      companies: this.store.query('company', { include: 'company_markets' }),
      countries: this.store.findAll('country')
    });
  }
}
