import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class FamilyCreateRoute extends ModalRoute {
  model() {
    return hash({
      family: this.store.createRecord('product-family')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('product-family')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
