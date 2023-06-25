import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class PermalinkCreateRoute extends ModalRoute {
  model() {
    return hash({
      permalink: this.store.createRecord('permalink', {
        redirectTo: 'https://'
      })
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('permalink')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
