import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class EventCreateController extends Controller {
  @service router;

  @tracked isSaving = false;

  get event() {
    return this.model.event;
  }

  get preventSave() {
    return (
      !this.event.name ||
      !this.event.country.get('id') ||
      !this.event.city ||
      !this.event.startDate ||
      !this.event.description
    );
  }

  @action
  async onSave() {
    this.isSaving = true;

    const success = () => {
      window.scrollTo(0, 0);
      this.router.transitionTo('secure.events.event', this.event.id);
    };

    const fail = (error) => {
      console.error('save failed', error);
    };

    const done = () => {
      this.isSaving = false;
    };

    this.event
      .save({
        adapterOptions: {
          whitelist: [
            'name',
            'startDate',
            'endDate',
            'city',
            'country',
            'description'
          ]
        }
      })
      .then(success)
      .catch(fail)
      .finally(done);
  }
}
