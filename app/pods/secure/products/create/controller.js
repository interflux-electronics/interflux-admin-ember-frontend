import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ProductCreateController extends Controller {
  @service router;

  @action
  async beforeSave() {
    const record = this.model.product;
    record.slug = record.name.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    await record
      .save({
        adapterOptions: {
          whitelist: ['slug', 'name']
        }
      })
      .then((response) => {
        console.debug(`created record with id: ${response.id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  @action
  async afterSave() {
    this.router.transitionTo('secure.products.product', this.model.product.id);
  }
}
