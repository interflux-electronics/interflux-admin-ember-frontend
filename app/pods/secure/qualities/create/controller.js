import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class QualityCreateController extends Controller {
  @service router;

  @action
  async beforeSave() {
    const record = this.model.quality;
    record.slug = record.text.toLowerCase().replace(/\s/g, '-');
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
    this.router.transitionTo('secure.qualities.quality', this.model.quality.id);
  }
}
