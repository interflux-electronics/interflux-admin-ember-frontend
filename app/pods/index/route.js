import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service auth;

  beforeModel() {
    if (this.auth.token) {
      console.warn('Found auth token, redirecting to secure.index');
      this.transitionTo('secure.index');
    }
  }
}
