import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class FeatureRoute extends ModalRoute {
  model(params) {
    return hash({
      feature: this.store.findRecord('feature', params.id, {
        include: [
          'products',
          'products.product_family',
          'product_features'
        ].join(','),
        reload: true
      })
    });
  }
}
