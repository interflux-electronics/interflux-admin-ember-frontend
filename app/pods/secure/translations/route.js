import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class TranslationsRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      translations: this.store.findAll('translation')
    });
  }
}
