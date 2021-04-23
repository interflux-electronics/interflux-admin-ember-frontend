import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageComponent extends Component {
  @tracked loading = true;
  @tracked error = false;

  @action
  onLoad() {
    this.loading = false;
    this.error = false;
  }

  @action
  onError() {
    this.loading = false;
    this.error = true;
    console.error('Failed to load image', this.args.src);
  }
}
