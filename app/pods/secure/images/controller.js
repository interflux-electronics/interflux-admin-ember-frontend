import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ImagesController extends Controller {
  @service api;
  @service router;
  @service store;
  @service translation;

  @tracked search = null;
  @tracked category = null;

  queryParams = ['search', 'category'];

  get records() {
    return this.model.images;
  }

  get config() {
    return {
      image: 'thumbURL',
      labels: [
        { label: 'path', property: 'path' },
        { label: 'for robots', property: 'alt' },
        { label: 'for humans', property: 'caption' }
      ]
    };
  }

  get filters() {
    return [
      {
        type: 'search',
        value: this.search
      },
      {
        type: 'options',
        property: 'category',
        value: this.category,
        options: [
          {
            label: 'products',
            value: 'products'
          },
          {
            label: 'processes',
            value: 'processes'
          },
          {
            label: 'people',
            value: 'people'
          },
          {
            label: 'logos',
            value: 'logos'
          },
          {
            label: 'icons',
            value: 'icons'
          }
        ]
      }
    ];
  }

  @action
  onClickRecord(record) {
    this.router.transitionTo('secure.images.image', record.id);
  }

  get buttons() {
    return [
      {
        label: 'Upload image',
        theme: 'medium green'
      }
    ];
  }

  @action
  onClickButton(button) {
    if (button.label === 'Upload image') {
      this.router.transitionTo('secure.images.create');
    }
  }
}
