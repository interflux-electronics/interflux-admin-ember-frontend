import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class OrderRoute extends ModalRoute {
  model(params) {
    return hash({
      // order: this.store.findRecord('order', params.id, {})
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
