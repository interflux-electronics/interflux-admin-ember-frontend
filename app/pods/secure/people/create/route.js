import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class PersonCreateRoute extends ModalRoute {
  model() {
    return hash({
      person: this.store.createRecord('person')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('person')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
