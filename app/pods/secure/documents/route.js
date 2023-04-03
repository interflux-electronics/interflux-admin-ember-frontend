import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class DocumentsRoute extends BaseRoute {
  needs = ['read_documents'];

  model() {
    return hash({
      documents: this.store.findAll('document'),
      categories: this.store.findAll('document-category')
    });
  }
}
