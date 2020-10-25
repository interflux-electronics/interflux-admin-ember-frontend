import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class ImageRoute extends ModalRoute {
  model(params) {
    return hash({
      image: this.store.findRecord('image', params.id, {
        include: ['products'].join(','),
        reload: true
      })
      // delay: new Promise((resolve, reject) => setTimeout(reject, 3000))
    });
  }
}
