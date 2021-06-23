import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class CompanyCreateRoute extends ModalRoute {
  model() {
    return hash({
      company: this.store.createRecord('company')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('company')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
