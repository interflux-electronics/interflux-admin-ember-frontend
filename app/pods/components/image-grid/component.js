import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageGridComponent extends Component {
  @tracked max = 50;

  get sortedImages() {
    return this.args.images.sortBy('path').slice(0, this.max);
  }

  get showButton() {
    return this.max < this.args.images.length;
  }

  @action
  showNext50() {
    this.max = this.max + 50;
  }
}
