import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';

export default class LoginRoute extends BaseRoute {
  @service auth;

  beforeModel() {
    if (this.auth.token) {
      console.warn('Found auth token, redirecting to secure.index');
      this.router.transitionTo('secure.index');
    }
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('email', null);
      controller.set('password', null);
    }
  }
}
