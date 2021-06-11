import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class LanguagesRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      leads: this.store.findAll('lead')
    });
  }
}
