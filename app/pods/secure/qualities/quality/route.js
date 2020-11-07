import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class QualityRoute extends ModalRoute {
  model(params) {
    return hash({
      quality: this.store.findRecord('quality', params.id, {
        reload: true,
        include: [
          'products',
          'products.product_family',
          'product_qualities'
        ].join(',')
      })
    });
  }
}
