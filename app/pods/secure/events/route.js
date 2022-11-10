import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class EventsRoute extends BaseRoute {
  model() {
    return hash({
      events: this.store.findAll('event')
    });
  }
}
