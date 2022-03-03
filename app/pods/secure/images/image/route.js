import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ImageRoute extends ModalRoute {
  model(params) {
    return hash({
      image: this.store.findRecord('image', params.id, {
        include: ['products', 'product_images', 'company', 'cdn_files'].join(
          ','
        )
      })
    });
  }
}
