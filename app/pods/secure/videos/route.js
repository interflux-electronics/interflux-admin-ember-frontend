import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class VideosRoute extends BaseRoute {
  @service store;

  model() {
    return hash({
      videos: this.store.findAll('video')
    });
  }
}
