import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class WebinarController extends Controller {
  @service store;
  @service router;

  @action
  async destroyRecord() {
    console.warn(`destroying record ${this.model.webinar.id}`);
    await this.model.webinar.destroyRecord();
    console.warn('destroyed');
    this.router.transitionTo('secure.webinars');
  }
}
