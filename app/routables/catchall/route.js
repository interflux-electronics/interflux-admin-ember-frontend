import Route from '@ember/routing/route';

export default class CatchallRoute extends Route {
  beforeModel(transition) {
    console.warn('Unknown route, redirecting to index');
    console.warn(location.href);
    console.warn({ transition, location });
    this.transitionTo('index');
  }
}
