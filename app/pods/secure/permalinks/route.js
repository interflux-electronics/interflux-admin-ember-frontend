import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class PermalinksRoute extends BaseRoute {
  needs = ['read_permalinks'];

  model() {
    return hash({
      permalinks: this.store.findAll('permalink')
    });
  }
}
