import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ProcessRoute extends ModalRoute {
  model(params) {
    return hash({
      process: this.store.findRecord('feature', params.id, {
        include: ['products', 'products.product_family'].join(','),
        reload: true
      })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
