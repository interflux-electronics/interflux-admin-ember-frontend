import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class FamilyRoute extends ModalRoute {
  model(params) {
    return hash({
      family: this.store.findRecord('product-family', params.id, {
        include: ['products', 'product_family_images'].join(','),
        reload: true
      })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
