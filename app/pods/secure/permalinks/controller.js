import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class PermalinksController extends Controller {
  @service router;

  @tracked search = null;
  @tracked host = 'all';

  queryParams = ['search', 'host'];

  get records() {
    return this.model.permalinks;
  }

  get config() {
    return {
      labels: [
        { label: 'Host', property: 'host' },
        { label: 'Path', property: 'path' },
        { label: 'ID', property: 'slug' }
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
        property: 'host',
        value: this.host,
        options: [
          {
            label: 'All',
            value: 'all',
            count: {
              color: 'green-1'
            }
          },
          {
            label: 'interflux.com',
            value: 'interflux.com',
            count: {
              color: 'green-1'
            }
          },
          {
            label: 'interflux.de',
            value: 'interflux.de',
            count: {
              color: 'green-1'
            }
          },
          {
            label: 'interflux.fr',
            value: 'interflux.fr',
            count: {
              color: 'green-1'
            }
          },
          {
            label: 'cdn.interflux.com',
            value: 'cdn.interflux.com',
            count: {
              color: 'green-1'
            }
          }
        ]
      }
    ];
  }

  @action
  onClickRecord(record) {
    this.router.transitionTo('secure.permalinks.permalink', record.id);
  }

  get buttons() {
    return [
      {
        label: 'Create',
        theme: 'medium green'
      }
    ];
  }

  @action
  onClickButton(button) {
    if (button.label === 'Create') {
      this.router.transitionTo('secure.permalinks.create');
    }
  }
}
