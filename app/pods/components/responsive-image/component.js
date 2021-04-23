import ENV from 'interflux/config/environment';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

// function arg(object, property) {
//   return {
//     get() {
//       const value = this.args[property];
//       if (!value) {
//         console.warn(`missing argument: ${property}`);
//       }
//       return value;
//     },
//     set() {
//       console.warn(`argument ${property} is read-only`);
//     }
//   };
// }

export default class ResponsiveImageComponent extends Component {
  // @arg path;
  // @arg variations;
  // @arg caption;
  // @arg alt;

  @service browser;

  get path() {
    return this.args.path;
  }

  get variations() {
    return this.args.variations;
  }

  get caption() {
    return this.args.caption;
  }

  get alt() {
    return this.args.alt;
  }

  get hasJPG() {
    return this.variations.includes('.jpg');
  }

  get hasWEBP() {
    return this.variations.includes('.webp');
  }

  get hasPNG() {
    return this.variations.includes('.png');
  }

  get hasSVG() {
    return this.variations.includes('.svg');
  }

  get hasSizes() {
    return this.variations.includes('@');
  }

  get JPGs() {
    return this.variations.split(',').filter((x) => x.split('.')[1] === 'jpg');
  }

  get WEBPs() {
    return this.variations.split(',').filter((x) => x.split('.')[1] === 'webp');
  }

  get JPGsizes() {
    return this.JPGs.map((x) => x.split('.')[0].replace('@', ''));
  }

  get WEBPsizes() {
    return this.JPGs.map((x) => x.split('.')[0].replace('@', ''));
  }

  // PICTURE

  // When the <picture> element is inserted we register it for later use.
  @action
  register(element) {
    this.picture = element;
  }

  // The <picture> element
  @tracked picture;

  // This component looks at the actual width the <picture> element and the screen density and
  // decideds which width is the smallest width, which still renders a sharp image.
  get optimalWidth() {
    const pixelRatio = window.devicePixelRatio || 1;
    return this.picture.offsetWidth * pixelRatio;
  }

  // Returns the JPG size "200x200" which has a width above and closest to the optimal width.
  get closestJPGsize() {
    return this.closestSize(this.JPGsizes);
  }

  // Returns the WEBP size "200x200" which has a width above and closest to the optimal width.
  get closestWEBPsize() {
    return this.closestSize(this.WEBPsizes);
  }

  // Accepts and array of sizes "200x200".
  // Returns the one which is above and closest to the optimal width.
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

  // To create a responsive image we ideally we use the native HTML5 <picture> approach with
  // <source> and <img> inside:
  //
  // <picture>
  //   <source src="image.webp" type="image/webp" />
  //   <img src="image.jpg" width="200" height="200" alt="foo" />
  // </picture>
  //
  // However, browsers end up downloading both the JPG and WEBP!
  // https://www.smashingmagazine.com/2013/05/how-to-avoid-duplicate-downloads-in-responsive-images/
  // Thus we perform the logic ourselves and render a simple <img> in the end.
  //
  get html() {
    const { path, variations, picture } = this;
    const { cdnHost } = ENV;

    if (!path) {
      return console.warn('no path');
    }
    if (!variations) {
      return console.warn('no variations', this.path);
    }
    if (!picture) {
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
      console.warn('<ResponsiveImage> failed to load image', this.path);
    };

    if (this.alt) {
      img.alt = this.alt;
    }

    // If SVG, render immediately for the are sizeless.
    if (this.hasSVG) {
      img.src = `${cdnHost}/${path}.svg`;
      fragment.append(img);
      return fragment;
    }

    // If WEBP files exist and the browser supports them, then render WEBP instead of JPG.
    if (this.hasWEBP && this.browser.supportsWEBP) {
      const size = this.closestWEBPsize;
      if (size) {
        img.src = `${cdnHost}/${path}@${size}.webp`;
        img.width = size.split('x')[0];
        img.height = size.split('x')[1];
      } else {
        img.src = `${cdnHost}/${path}.jpg`;
      }
      fragment.append(img);
      return fragment;
    }

    // If no WEBP exist or the browser does not support WEBP, then render the trusty old JPG.
    if (this.hasJPG) {
      const size = this.closestJPGsize;
      if (size) {
        img.src = `${ENV.cdnHost}/${path}@${size}.jpg`;
        img.width = size.split('x')[0];
        img.height = size.split('x')[1];
      } else {
        img.src = `${ENV.cdnHost}/${path}.jpg`;
      }
      fragment.append(img);
      return fragment;
    }

    // Image is neither SVG, WEBP or JPG?
    return null;
  }

  @tracked _status = 'loading'; // loading, error, invalid, done

  get status() {
    return this.path && this.variations ? this._status : 'invalid';
  }

  set status(value) {
    this._status = value;
  }

  get showLoading() {
    return this.status === 'loading';
  }

  get showError() {
    return this.status === 'error';
  }

  get orientation() {
    if (!this.picture) {
      return 'square'; // invalid icon is square
    }
    if (!this.variations) {
      return 'square'; // invalid icon is square
    }
    if (!this.closestJPGsize) {
      return 'no-jpg';
    }
    const size = this.closestJPGsize.split('x');
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
