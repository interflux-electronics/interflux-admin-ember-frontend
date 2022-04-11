import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';

export default class IndexRoute extends BaseRoute {
  @service auth;

  beforeModel() {
    if (this.auth.token) {
      console.warn('Found auth token, redirecting to secure.index');
      this.router.transitionTo('secure.index');
    }
  }
}
