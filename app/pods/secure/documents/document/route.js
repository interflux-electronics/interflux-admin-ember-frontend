import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class DocumentRoute extends ModalRoute {
  model(params) {
    return hash({
      document: this.store.findRecord('document', params.id, {
        include: ['products', 'product_documents', 'cdn_files'].join(','),
        reload: true
      })
    });
  }
}
