import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class SessionsRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      sessions: this.store.findAll('session'),
      countries: this.store.findAll('country')
    });
  }
}
