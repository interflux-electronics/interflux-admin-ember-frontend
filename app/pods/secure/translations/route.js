import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class TranslationsRoute extends BaseRoute {
  @service store;

  needs = ['read_translations'];

  model() {
    return hash({
      translations: this.store.findAll('translation')
    });
  }

  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('search', null);
      controller.set('language', null);
      controller.set('statuses', 'to-translate,to-update,to-review,done,error');
    }
  }
}
