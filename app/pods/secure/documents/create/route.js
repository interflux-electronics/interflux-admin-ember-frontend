import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class DocumentCreateRoute extends ModalRoute {
  model() {
    return hash({
      document: this.store.createRecord('document'),
      categories: this.store.findAll('document-category')
    });
  }

  @action
  willTransition() {
    this.store
      .peekAll('document')
      .filterBy('isNew')
      .forEach((rec) => rec.deleteRecord());
  }
}
