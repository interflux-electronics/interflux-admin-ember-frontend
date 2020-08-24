import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class FeaturesRoute extends Route {
  @service store;

  model() {
    return hash({
      features: this.store.query('feature', {
        filter: {
          category: 'quality'
        }
      })
    });
  }
}
