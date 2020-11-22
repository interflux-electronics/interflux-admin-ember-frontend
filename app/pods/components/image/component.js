import ENV from 'interflux/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

function arg(object, property) {
  return {
    get() {
      const value = this.args[property];
      if (!value) {
        console.warn(`missing argument: ${property}`);
      }
      return value;
    },
    set() {
      console.warn(`argument ${property} is read-only`);
    }
  };
}

export default class ImageComponent extends Component {
  @arg image;

  get variations() {
    return this.image ? this.image.get('variations') : null;
  }

  get path() {
    return this.image ? this.image.get('path') : null;
  }

  get caption() {
    return this.image ? this.image.get('caption') : null;
  }

  get alt() {
    return this.image ? this.image.get('alt') : null;
  }

  // The <picture> element
  @tracked picture;

  // When the <picture> element is inserted we register it for later use
  @action
  register(element) {
    this.picture = element;
  }

  get html() {
    if (!this.path) {
      return console.warn('no path');
    }
    if (!this.variations) {
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
      console.warn('<Image> failed to load image', this.path);
    };
    const cdn = ENV['cdnHost'];
    img.src = `${cdn}/${this.path}@${this.closestJPG}.jpg`;
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
      source.srcset = `${cdn}/${this.path}@${this.closestWEBP}.webp`;
      fragment.prepend(source);
    }

    return fragment;
  }

  get optimalWidth() {
    const pixelRatio = window.devicePixelRatio || 1;
    return this.picture.offsetWidth * pixelRatio;
  }

  get JPGs() {
    return this.variations
      .split(',')
      .filter((x) => x.split('.')[1] === 'jpg')
      .map((x) => x.split('.')[0].replace('@', ''));
  }

  get WEBPs() {
    return this.variations
      .split(',')
      .filter((x) => x.split('.')[1] === 'webp')
      .map((x) => x.split('.')[0].replace('@', ''));
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
    if (!this.variations) {
      return 'invalid';
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
