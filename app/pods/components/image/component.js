import ENV from 'interflux/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageComponent extends Component {
  // The <picture> element
  @tracked picture;

  // When the <picture> element is inserted we register it for later use
  @action
  register(element) {
    this.picture = element;
  }

  get html() {
    if (!this.args.path) {
      return console.warn('no path');
    }
    if (!this.args.variations) {
      return console.warn('no variations', this.path);
    }
    if (!this.picture) {
      return null;
    }

    // Before we add things to the DOM we'll append them to a fragment
    const fragment = document.createDocumentFragment();

    // Create <img> element
    const img = new Image();

    // Note: The img.onload event doesn't always fire as expected when images
    // are cached or load fast. For it to work correctly, it's important to
    // attach the onload event before rendering it, so not in the Ember
    // template (unfortunately). Instead we create the DOM in JS and then render
    // it with Ember.
    // Resources:
    // https://stackoverflow.com/questions/12354865/image-onload-event-and-browser-cache
    // https://stackoverflow.com/questions/23657424/why-image-complete-property-always-return-true-even-if-there-is-no-src-tag
    img.onload = () => {
      this.status = 'done';
    };
    img.onerror = () => {
      this.status = 'error';
      console.warn('<Image> failed to load image', this.args.path);
    };
    const cdn = ENV['cdnHost'];
    img.src = `${cdn}/${this.args.path}@${this.closestJPG}.jpg`;
    img.width = this.closestJPG.split('x')[0];
    img.height = this.closestJPG.split('x')[1];
    if (this.alt) {
      img.alt = this.alt;
    }
    fragment.append(img);

    // If WEBP is supported, create <source> element
    if (this.closestWEBP) {
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = `${cdn}/${this.args.path}@${this.closestWEBP}.webp`;
      fragment.prepend(source);
    }

    return fragment;
  }

  get optimalWidth() {
    const pixelRatio = window.devicePixelRatio || 1;
    return this.picture.offsetWidth * pixelRatio;
  }

  get JPGs() {
    return this.args.variations
      .split(',')
      .filter((x) => x.split('.')[1] === 'jpg')
      .map((x) => x.split('.')[0]);
  }

  get WEBPs() {
    return this.args.variations
      .split(',')
      .filter((x) => x.split('.')[1] === 'webp')
      .map((x) => x.split('.')[0]);
  }

  get closestJPG() {
    return this.closestSize(this.JPGs);
  }

  get closestWEBP() {
    return this.closestSize(this.WEBPs);
  }

  closestSize(sizes) {
    const distances = sizes.map((size) => {
      const width = size.split('x')[0];
      return width - this.optimalWidth;
    });

    const larger = distances.filter((d) => d >= 0);
    const smaller = distances.filter((d) => d < 0);

    const closestDistance = larger.length
      ? Math.min(...larger)
      : Math.max(...smaller);

    return sizes.find((size) => {
      const width = size.split('x')[0];
      return width - this.optimalWidth === closestDistance;
    });
  }

  // The state of this component (loading | error | done)
  @tracked status = 'loading';

  get showLoading() {
    return this.status === 'loading';
  }

  get showError() {
    return this.status === 'error';
  }

  get orientation() {
    if (!this.picture) {
      return 'loading';
    }
    if (!this.closestJPG) {
      return 'invalid';
    }
    const size = this.closestJPG.split('x');
    const w = parseInt(size[0]);
    const h = parseInt(size[1]);
    if (w === h) {
      return 'square';
    }
    if (w > h) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  }
}
