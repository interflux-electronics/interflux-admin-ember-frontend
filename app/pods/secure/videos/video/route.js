import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class VideoRoute extends ModalRoute {
  model(params) {
    return hash({
      video: this.store.findRecord('video', params.id, {
        include: ['cdn_files'].join(',')
      })
    });
  }
}
