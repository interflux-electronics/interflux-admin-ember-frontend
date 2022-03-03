import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class PersonRoute extends ModalRoute {
  model(params) {
    return hash({
      person: this.store.findRecord('person', params.id, {
        include: ['companies', 'company_members'].join(',')
      })
    });
  }
}
