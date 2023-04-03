import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class LeadsRoute extends BaseRoute {
  needs = ['read_leads'];

  model() {
    return hash({
      leads: this.store.findAll('lead')
    });
  }
}
