import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class QualitiesRoute extends Route {
  @service store;

  model() {
    return hash({
      qualities: this.store.findAll('quality')
    });
  }
}
