import ENV from 'interflux/config/environment';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeadDataService extends Service {
  @tracked title = 'Interflux Admin';
  @tracked description = 'For Interflux administrators only.';

  // Assign a canonical URL in case multiple URLs can refer to the same page. This is most useful
  // on pages which employ query params to set local page but are not intended to be indexed by
  // crawlers as seperate pages. Also to avoid development and staging environments from being
  // indexed.
  //
  // Gotcha: Avoid window.location.href because we run this Ember app in Fastboot, which is Node,
  // which does not have access to window and will go nuclear.
  //
  // Omit the domain, locale and leading slash.
  // For example: 'products/for-wave-soldering'
  @tracked canonicalPath = '';

  get canonicalURL() {
    return `https://admin.interflux.com/${this.canonicalPath}`;
  }

  // The open graph type describes the content of the page.
  // Most commonly: website, product, article, place, ...
  // Documentation: https://ogp.me/#types
  @tracked ogType = 'website';

  // The Open Graph images are meant to be shown in social media. There is no consensus on which
  // size this image should be, 1200 x 630 (1.9:1) seems to be most adopted.
  // https://iamturns.com/open-graph-image-size/
  //
  // To include the the open graph image, either set the 4 properties below manually:
  //
  // this.headData.setProperties({
  //   imagePath: '/images/some.png',
  //   imageWidth: '1200',
  //   imageHeight: '630',
  //   imageAlt: 'some logo'
  // })
  //
  // Or use setImage() to find the image closes to the optimal size of 1200x630:
  //
  // this.headData.setImage(path, variations, alt);
  //
  @tracked imagePath; // '/images/products/IF-2005M/IF-2005M-10L-angle'
  @tracked imageWidth;
  @tracked imageHeight;
  @tracked imageAlt;

  get imageURL() {
    return `${ENV.cdnHost}/${this.imagePath}`;
  }

  get showImage() {
    return (
      this.imageURL && this.imageWidth && this.imageHeight && this.imageAlt
    );
  }

  // Finds the JPG nearest and above the optimal width of 1200.
  setImage(params) {
    const { path, variations, alt } = params;

    if (!path || !variations || !alt) {
      return console.warn('setImage() missing param', path, variations, alt);
    }

    const JPGs = variations.split(',').filter((x) => x.split('.')[1] === 'jpg');

    if (!JPGs.length) {
      return console.warn('setImage() no JPGs');
    }

    const optimalWidth = 1200;
    const sizes = JPGs.map((x) => x.split('.')[0].replace('@', '')); // ['200x200','400x400']
    const distances = sizes.map((size) => {
      const width = size.split('x')[0];
      return width - optimalWidth;
    });
    const larger = distances.filter((d) => d >= 0);
    const smaller = distances.filter((d) => d < 0);
    const closestDistance = larger.length
      ? Math.min(...larger)
      : Math.max(...smaller);
    const optimalSize = sizes.find((size) => {
      return size.split('x')[0] - optimalWidth === closestDistance;
    });
    const width = optimalSize.split('x')[0];
    const height = optimalSize.split('x')[1];

    this.imagePath = `${path}@${width}x${height}.jpg`;
    this.imageWidth = width;
    this.imageHeight = height;
    this.imageAlt = alt;
  }

  // For debugging environments

  get environment() {
    return ENV.environment;
  }

  get gitBranch() {
    return ENV.gitBranch;
  }

  get gitRevision() {
    return ENV.gitRevision;
  }

  get buildTimestamp() {
    return ENV.buildTimestamp;
  }

  // Reset all head data to prevent meta data from other pages lingering.
  reset() {
    this.title = 'Interflux Admin';
    this.description = 'For Interflux administrators only.';
    this.canonicalPath = '';
    this.ogType = 'website';
    this.imagePath = null;
    this.imageVariations = null;
    this.imagePath = null;
    this.imageWidth = null;
    this.imageHeight = null;
    this.imageAlt = null;
  }
}
