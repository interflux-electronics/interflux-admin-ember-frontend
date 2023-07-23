import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class ImageCreateRoute extends ModalRoute {
  model() {
    return hash({
      image: this.store.createRecord('image')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('image')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
