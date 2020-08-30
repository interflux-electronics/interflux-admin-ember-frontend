// TODO: write tests

import ENV from 'interflux/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { computed } from '@ember/object';

export default class ImageResponsiveComponent extends Component {
  // The state of this component (loading | error | done)
  @tracked status = 'loading';

  // The <picture> element
  @tracked picture;

  // When the <picture> element is inserted we register it for later use
  @action
  register(element) {
    this.picture = element;
  }

  @computed('picture', 'args.{path,image}')
  get html() {
    if (!this.valid) {
      console.warn('<ResponsiveImage> missing path, sizes or formats');
      return null;
    }
    if (!this.picture) {
      return null;
    }
    const size = this.optimalSize(this.picture);
    const fragment = this.fragment(size);
    return fragment;
  }

  // 1. Find th optimal size for <picture> width and screen pixeldensity
  optimalSize(picture) {
    const sizes = this.sizes;
    const pixelRatio = window.devicePixelRatio || 1;
    const optimalWidth = picture.offsetWidth * pixelRatio;
    const distances = sizes.map(size => {
      const width = size.split('x')[0];
      return width - optimalWidth;
    });

    const larger = distances.filter(d => d >= 0);
    const smaller = distances.filter(d => d < 0);

    const closestDistance = larger.length
      ? Math.min(...larger)
      : Math.max(...smaller);

    return sizes.find(size => {
      const width = size.split('x')[0];
      return width - optimalWidth === closestDistance;
    });
  }

  fragment(size) {
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
      console.warn('<ResponsiveImage> failed to load image', this.path);
    };
    const cdn = ENV['cdnHost'];
    img.src = `${cdn}/${this.path}@${size}.jpg`;
    img.width = size.split('x')[0];
    img.height = size.split('x')[1];
    if (this.alt) {
      img.alt = this.alt;
    }
    fragment.append(img);

    // If WEBP is supported, create <source> element
    if (this.webp) {
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = `${cdn}/${this.path}@${size}.webp`;
      fragment.prepend(source);
    }

    return fragment;
  }

  get path() {
    return this.args.image ? this.args.image.get('path') : this.args.path;
  }

  get sizes() {
    return this.args.image ? this.args.image.get('sizes') : this.args.sizes;
  }

  get formats() {
    return this.args.image ? this.args.image.get('formats') : this.args.formats;
  }

  get alt() {
    return this.args.image ? this.args.image.get('alt') : this.args.alt;
  }

  get webp() {
    return this.formats.includes('webp');
  }

  get valid() {
    if (!this.path || !this.sizes || !this.formats) {
      this.status = 'error';
      return false;
    }

    return true;
  }

  @computed('args.{path,image}')
  get orientation() {
    if (!this.valid) {
      return 'invalid';
    }
    const sizes = this.sizes;
    const size = sizes[0].split('x');
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

  @computed('status')
  get showLoading() {
    return this.status === 'loading';
  }

  @computed('status')
  get showError() {
    return this.status === 'error';
  }

  @action
  onClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}
