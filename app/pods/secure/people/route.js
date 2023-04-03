import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class PeopleRoute extends BaseRoute {
  needs = ['read_people'];

  model() {
    return hash({
      companies: this.store.findAll('company'),
      people: this.store.findAll('person', {
        include: ['company_members'].join(',')
      })
    });
  }
}
