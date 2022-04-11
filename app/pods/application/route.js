import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends BaseRoute {
  @service auth;

  constructor() {
    super(...arguments);

    this.auth.revive();
  }
}
