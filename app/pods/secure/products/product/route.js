import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ProductRoute extends ModalRoute {
  model(params) {
    return hash({
      product: this.store.findRecord('product', params.id, {
        include: [
          'image',
          'documents',
          'qualities',
          'uses',
          'product_images',
          'product_images.image',
          'product_qualities',
          'product_uses',
          'product_documents',
          'product_videos',
          'product_videos.video'
        ].join(',')
      }),
      families: this.modelFor('secure.products').families
    });
  }
}
