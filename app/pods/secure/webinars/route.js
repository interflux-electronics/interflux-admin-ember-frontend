import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class WebinarsRoute extends BaseRoute {
  needs = ['read_webinars'];

  model() {
    return hash({
      webinars: this.store.findAll('webinar')
    });
  }
}
