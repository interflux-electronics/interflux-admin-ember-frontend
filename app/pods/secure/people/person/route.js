import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ProductsProductRoute extends ModalRoute {
  model(params) {
    return hash({
      person: this.store.findRecord('person', params.id, { reload: true })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
