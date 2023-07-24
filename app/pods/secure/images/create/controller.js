import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ImageCreateController extends Controller {
  @service store;
  @service router;

  @tracked subject = null;
  @tracked product = null;
  @tracked products = null;

  @tracked loadingProducts = true;
  @tracked loadingProductImages = true;

  get image() {
    return this.model.image;
  }

  get subjects() {
    return [
      {
        id: 'product',
        label: 'a product'
      },
      {
        id: 'person',
        label: 'a person'
      },
      {
        id: 'other',
        label: 'something else'
      }
    ];
  }

  @action
  async onSelectSubject(subject) {
    this.subject = subject;
    if (!subject) {
      return;
    }
    if (subject.id === 'product') {
      this.loadingProducts = true;
      this.products = await this.store.findAll('product');
      this.loadingProducts = false;
    }
  }

  @action
  async onSelectProduct(product) {
    this.product = product;
    if (!product) {
      return;
    }
    this.loadingProductImages = true;
    this.product = await this.store.findRecord('product', this.product.id, {
      include: [
        'product_images',
        'product_images.image',
        'product_family',
        'product_family.product_family'
      ].join(',')
    });
    await this.delay(1000);
    this.image.alt = `${this.product.name} ${this.product.familyLabel} something`;
    this.loadingProductImages = false;
  }

  delay(ms) {
    return new Promise((approve) => {
      window.setTimeout(approve, ms);
    });
  }

  get cdnPath() {
    return `images/products/${this.product.id}`.replace(/\s/g, '-');
  }

  // get person() {
  //   return this.model.person;
  // }

  // get preventSave() {
  //   return !this.person.firstName || !this.person.lastName;
  // }

  // @action
  // async onSave() {
  //   this.isSaving = true;

  //   const success = () => {
  //     this.router.transitionTo('secure.people.person', this.person.id);
  //   };

  //   const fail = (error) => {
  //     console.error('save failed', error);
  //   };

  //   const done = () => {
  //     this.isSaving = false;
  //   };

  //   this.person
  //     .save({
  //       adapterOptions: {
  //         whitelist: ['firstName', 'lastName']
  //       }
  //     })
  //     .then(success)
  //     .catch(fail)
  //     .finally(done);
  // }
}
