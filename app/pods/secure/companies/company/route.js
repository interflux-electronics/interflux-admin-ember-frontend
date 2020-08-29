import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class CompanyRoute extends ModalRoute {
  model(params) {
    return hash({
      countries: this.modelFor('secure.companies').countries,
      company: this.store.findRecord('company', params.id, {
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
      // delay: new Promise((resolve, reject) => setTimeout(resolve, 3000))
    });
  }
}
