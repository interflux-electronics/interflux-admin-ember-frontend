import BaseRoute from 'interflux/pods/base/route';

export default class VisitorRoute extends BaseRoute {
  needs = ['read_visitors'];

  beforeModel() {
    this.router.transitionTo('secure.visitors.who');
  }
}
