import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends BaseRoute {
  @service auth;

  beforeModel() {
    if (this.auth.token) {
      console.warn('Found auth token, redirecting to secure.index');
      this.transitionTo('secure.index');
    }
  }
}
