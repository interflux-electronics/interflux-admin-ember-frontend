import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProcessesRoute extends Route {
  @service store;

  model() {
    return hash({
      uses: this.store.findAll('use')
    });
  }
}
