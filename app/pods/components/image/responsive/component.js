import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageResponsiveComponent extends Component {
  @tracked loading = true;
  @tracked loadFailed = false;
  @tracked showImage = false;
  @tracked optimalWidth;
  @tracked optimalHeight;
  @tracked webp;

  constructor() {
    super(...arguments);
    this.webp = this.args.formats.includes('webp');
  }

  @action
  didInsert(element) {
    console.debug('<Image::Responsive> didInsertImg()', { element });
    this.computeOptimalSize(element);
  }

  @action
  willDestroy(element) {
    console.debug('<Image::Responsive> willDestroy()', { element });
  }

  @action
  computeOptimalSize(element) {
    const pixelRatio = window.devicePixelRatio || 1;
    const optimalWidth = element.offsetWidth * pixelRatio;

    let closestSize;
    let closestDifference;

    this.args.sizes.forEach(size => {
      const width = size.split('x')[0];
      const difference = width - optimalWidth;
      const isPositive = difference >= 0;
      const isCloser = closestDifference
        ? difference < closestDifference
        : true;

      if (isPositive && isCloser) {
        closestSize = size;
        closestDifference = difference;
      }
    });

    console.debug('<Image::Responsive> computeOptimalSize()', {
      width: element.offsetWidth,
      height: element.offsetHeight,
      sizes: this.args.sizes,
      pixelRatio,
      optimalWidth,
      closestSize
    });

    this.optimalHeight = closestSize.split('x')[0];
    this.optimalWidth = closestSize.split('x')[1];
    this.showImage = true;
  }

  @action
  onLoad() {
    console.debug('<Image::Responsive> onLoad()');
    this.loading = false;
    this.loadFailed = false;
  }

  @action
  onError(error) {
    console.error('<Image::Responsive> onError()', { error });
    this.loading = false;
    this.loadFailed = true;
  }
}
