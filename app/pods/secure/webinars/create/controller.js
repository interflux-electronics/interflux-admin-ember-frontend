import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class WebinarCreateController extends Controller {
  @service router;

  @tracked isSaving = false;

  get webinar() {
    return this.model.webinar;
  }

  get preventSave() {
    return !this.webinar.title;
  }

  @action
  async onSave() {
    this.isSaving = true;

    const success = () => {
      this.router.transitionTo('secure.webinars.webinar', this.webinar.id);
    };

    const fail = (error) => {
      console.error('save failed', error);
    };

    const done = () => {
      this.isSaving = false;
    };

    this.webinar
      .save({
        adapterOptions: {
          whitelist: ['title']
        }
      })
      .then(success)
      .catch(fail)
      .finally(done);
  }
}
