import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class DocumentsRoute extends Route {
  @service store;

  model() {
    return hash({
      documents: this.store.findAll('document'),
      languages: this.store.findAll('language'),
    });
  }
}
