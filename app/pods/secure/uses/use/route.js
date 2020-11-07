import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class UseRoute extends ModalRoute {
  model(params) {
    return hash({
      use: this.store.findRecord('use', params.id, {
        reload: true,
        include: ['products', 'products.product_family', 'product_uses'].join(
          ','
        )
      })
    });
  }
}
