import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class PeopleRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      people: this.store.findAll('person', {
        include: ['companies'].join(','),
        reload: true
      })
    });
  }
}
