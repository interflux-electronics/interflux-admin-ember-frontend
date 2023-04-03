import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class WebinarRoute extends ModalRoute {
  model(params) {
    return hash({
      event: this.store.findRecord('event', params.id, {
        include: ['country'].join(',')
      })
    });
  }
}
