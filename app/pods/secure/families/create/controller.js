import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FamilyCreateController extends Controller {
  @service router;

  @action
  async beforeSave() {
    const record = this.model.family;
    record.slug = record.namePlural.toLowerCase().replace(/\s/g, '-');
    await record
      .save()
      .then((response) => {
        console.debug(`created record with id: ${response.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  @action
  async afterSave() {
    this.router.transitionTo('secure.families.family', this.model.family.id);
  }
}
