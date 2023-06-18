import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProductCreateComponent extends Component {
  // @arg product;

  @service router;
  @service store;

  @tracked isSaving = false;
  @tracked record;

  get product() {
    return this.args.product;
  }

  get preventSave() {
    return !this.product.name || this.isSaving;
  }

  get slug() {
    return this.product.name.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  }

  @action
  async onSave() {
    this.isSaving = true;

    await this.store
      .findRecord('product', this.slug)
      .then((response) => {
        this.record = response;
      })
      .catch((response) => {
        console.error(response);
      });

    if (this.record) {
      return;
    }

    this.product.slug = this.slug;

    this.product
      .save({
        adapterOptions: {
          whitelist: ['name', 'slug']
        }
      })
      .then(() => {
        this.router.transitionTo('secure.products.product', this.product.id);
      })
      .catch((response) => {
        console.error('save failed', response);
        this.isSaving = false;
      });
  }
}
