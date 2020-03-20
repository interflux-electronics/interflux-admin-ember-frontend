import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class PeopleRoute extends Route {
  @service store;

  model() {
    return hash({
      people: this.store.findAll('person')
    });
  }
}
