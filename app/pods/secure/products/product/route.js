import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ProductRoute extends ModalRoute {
  model(params) {
    return hash({
      product: this.store.findRecord('product', params.id, {
        include: ['documents', 'images', 'features'].join(','),
        reload: true
      })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
