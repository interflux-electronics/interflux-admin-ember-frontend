import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class FamilyRoute extends ModalRoute {
  model() {
    return hash({
      families: this.modelFor('secure.families').families,
      family: this.store.createRecord('product-family')
    });
  }
}
