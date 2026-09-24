import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class FamilyRoute extends ModalRoute {
  model(params) {
    return hash({
      families: this.modelFor('secure.families').families,
      family: this.store.findRecord('product-family', params.id, {
        include: ['products'].join(',')
      })
    });
  }
}
