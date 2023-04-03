import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class VideosRoute extends BaseRoute {
  needs = ['read_videos'];

  model() {
    return hash({
      videos: this.store.findAll('video')
    });
  }
}
