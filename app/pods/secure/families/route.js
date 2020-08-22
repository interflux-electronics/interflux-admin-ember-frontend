import Route from '@ember/routing/route';

export default class SecureFamiliesRoute extends Route {
  model() {
    return this.store.findAll('product-family');
  }
}
