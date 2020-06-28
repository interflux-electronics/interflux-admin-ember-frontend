import Route from '@ember/routing/route';

export default class SecureFeaturesRoute extends Route {
  model() {
    return this.store.findAll('feature');
  }
}
