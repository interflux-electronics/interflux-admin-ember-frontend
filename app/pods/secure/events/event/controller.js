import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class EventController extends Controller {
  @service store;
  @service router;

  @action
  async destroyRecord() {
    console.warn(`destroying record ${this.model.event.id}`);
    await this.model.event.destroyRecord();
    console.warn('destroyed');
    this.router.transitionTo('secure.events');
  }
}
