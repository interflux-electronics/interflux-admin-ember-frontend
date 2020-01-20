import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ImagesImageRoute extends Route {
  @service store;

  model(params){
    return hash({
      image: this.store.find('image', params.uuid)
    });
  }
}
