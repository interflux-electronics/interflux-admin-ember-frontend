import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class DocumentRoute extends ModalRoute {
  model(params) {
    return hash({
      categories: this.store.findAll('document-category'),
      document: this.store.findRecord('document', params.id, {
        include: [
          'cdn_files',
          'document_category',
          'products',
          'product_documents'
        ].join(',')
      })
    });
  }

  // Properties on controllers will linger when switching between models.
  // To avoid, we reset them each time the route is exited.
  // https://api.emberjs.com/ember/3.24/classes/Route/methods?anchor=resetController
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('deleting', false);
    }
  }
}
