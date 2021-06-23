import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class PeopleRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      companies: this.store.findAll('company'),
      people: this.store.findAll('person', {
        include: ['company_members'].join(','),
        reload: true
      })
    });
  }
}
