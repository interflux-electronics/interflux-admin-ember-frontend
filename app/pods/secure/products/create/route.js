import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class ProductCreateRoute extends ModalRoute {
  model() {
    return hash({
      product: this.store.createRecord('product')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('product')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
