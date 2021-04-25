import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class QualityCreateRoute extends ModalRoute {
  model() {
    return hash({
      quality: this.store.createRecord('quality')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('quality')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
