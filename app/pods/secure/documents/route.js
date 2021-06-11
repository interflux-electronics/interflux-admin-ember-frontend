import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class DocumentsRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      documents: this.store.findAll('document'),
      categories: this.store.findAll('document-category')
    });
  }
}
