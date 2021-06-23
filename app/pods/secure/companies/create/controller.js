import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class FamilyCreateController extends Controller {
  @service router;

  @tracked isSaving = false;

  get company() {
    return this.model.company;
  }

  get preventSave() {
    return !this.company.country.get('id') || !this.company.businessName;
  }

  @action
  async onSave() {
    this.isSaving = true;

    const success = () => {
      this.router.transitionTo('secure.companies.company', this.company.id);
    };

    const fail = (error) => {
      console.error('save failed', error);
    };

    const done = () => {
      this.isSaving = false;
    };

    this.company
      .save({
        adapterOptions: {
          whitelist: ['businessName', 'country']
        }
      })
      .then(success)
      .catch(fail)
      .finally(done);
  }
}
