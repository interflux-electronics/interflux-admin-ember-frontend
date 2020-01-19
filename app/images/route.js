import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ImagesRoute extends Route {
  @service store;

  model(){
    return hash({
      images: this.store.findAll('image')
    })
  }
}
