import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class LanguagesRoute extends Route {
  @service store;

  model() {
    return hash({
      languages: this.store.findAll('language')
    });
  }
}
