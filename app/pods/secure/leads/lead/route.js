import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class LeadRoute extends ModalRoute {
  model(params) {
    return hash({
      lead: this.store.findRecord('lead', params.id, { reload: true })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
