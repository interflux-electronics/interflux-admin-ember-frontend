import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ProcessRoute extends ModalRoute {
  model(params) {
    return hash({
      process: this.store.findRecord('feature', params.id, {
        include: [
          // 'markets'
          // 'members',
          // 'members.person'
          // 'documents.language',
          // 'product-family',
          // 'product-images',
          // 'product-images.image',
          // 'product-variants',
          // 'product-variants.container',
          // 'product-processes',
          // 'product-variant.container.image',
          // 'features',
          // 'related-articles',
          // 'related-products',
          // 'related-products.main-group'
        ].join(',')
      })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
