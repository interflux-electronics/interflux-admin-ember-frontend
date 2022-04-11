import BaseRoute from 'interflux/pods/base/route';

export default class CatchallRoute extends BaseRoute {
  beforeModel(transition) {
    console.warn('Unknown route, redirecting to index');
    console.warn(location.href);
    console.warn({ transition, location });
    this.router.transitionTo('index');
  }
}
