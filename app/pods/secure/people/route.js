import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import { later } from '@ember/runloop';

export default class PeopleRoute extends Route {
  @service store;

  model() {
    return hash({
      people: this.store.findAll('person'),
      delay: new Promise(function(resolve) {
        later(function() {
          resolve({ msg: 'Hold Your Horses' });
        }, 3000);
      })
    });
  }
}
