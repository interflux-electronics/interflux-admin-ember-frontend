import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class VideosController extends Controller {
  @service api;
  @service router;
  @service store;
  @service translation;

  @tracked search = null;
  @tracked category = null;

  queryParams = ['search', 'category'];

  get records() {
    return this.model.videos;
  }

  get config() {
    return {
      image: 'thumbURL',
      labels: [{ label: 'title', property: 'title' }]
    };
  }

  get filters() {
    return [
      {
        type: 'search',
        value: this.search
      }
    ];
  }

  @action
  onClickRecord(record) {
    this.router.transitionTo('secure.videos.video', record.id);
  }

  get buttons() {
    return [
      {
        label: 'Upload video',
        theme: 'medium green'
      }
    ];
  }

  @action
  onClickButton(button) {
    if (button.label === 'Upload video') {
      this.router.transitionTo('secure.videos.create');
    }
  }

  // NEW

  get links() {
    return [
      {
        label: 'Who',
        route: 'secure.visitors.who'
      },
      {
        label: 'What',
        route: 'secure.visitors.what'
      },
      {
        label: 'How',
        route: 'secure.visitors.how'
      }
    ];
  }
}
