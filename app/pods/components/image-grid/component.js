import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ImageGridComponent extends Component {
  @tracked max = 5000;

  get sortedImages() {
    return this.args.images.sortBy('path').slice(0, this.max);
  }
}
