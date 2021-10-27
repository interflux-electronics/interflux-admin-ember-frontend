import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class WebinarCreateRoute extends ModalRoute {
  model() {
    return hash({
      webinar: this.store.createRecord('webinar')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('webinar')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
