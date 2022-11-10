import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class EventCreateRoute extends ModalRoute {
  model() {
    return hash({
      event: this.store.createRecord('event')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('event')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
