import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class WebinarsRoute extends Route {
  model() {
    return hash({
      webinars: this.store.findAll('webinar')
    });
  }
}
