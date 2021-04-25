import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class UseCreateRoute extends ModalRoute {
  model() {
    return hash({
      use: this.store.createRecord('use')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('use')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
