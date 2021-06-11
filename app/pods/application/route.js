import BaseRoute from 'interflux/pods/base/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends BaseRoute {
  @service auth;

  init() {
    this.auth.revive();
  }
}
