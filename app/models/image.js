import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class ImageModel extends Model {
  @attr('string') path;
  @attr('string') alt;
  @attr('string') caption;
  @attr('string') variations;

  @belongsTo('product', { inverse: 'image' }) product;
  @hasMany('product', { inverse: 'images' }) products;
  @hasMany('product-image') productImages;
  @hasMany('cdn-files') files;

  @belongsTo('company') company;

  get category() {
    return this.path.split('/')[1];
  }

  get JPGs() {
    return this.files.filterBy('isJPG').sortBy('width');
  }

  get WEBPs() {
    return this.files.filterBy('isWEBP').sortBy('width');
  }

  get PNGs() {
    return this.files.filterBy('isPNG').sortBy('width');
  }

  get SVGs() {
    return this.files.filterBy('isSVG');
  }

  get hasJPG() {
    return this.JPGs.length > 0;
  }

  get hasWEBP() {
    return this.WEBPs.length > 0;
  }

  get hasPNG() {
    return this.PNGs.length > 0;
  }

  get hasSVG() {
    return this.SVGs.length > 0;
  }

  get label() {
    return `${this.alt || ''} ${this.caption || ''}`;
  }

  get thumbURL() {
    const { path, variations } = this;

    if (!path || !variations) {
      return null;
    }

    const ext = variations.includes('.svg')
      ? 'svg'
      : variations.includes('.webp')
      ? 'webp'
      : 'jpg';

    if (!variations.includes('@')) {
      return `${ENV.cdnHost}/${path}.${ext}`;
    }

    const optimalWidth = 180;
    const subset = variations.split(',').filter((x) => x.split('.')[1] === ext);
    const sizes = subset.map((x) => x.split('.')[0].replace('@', ''));

    const distances = sizes.map((size) => {
      const width = size.split('x')[0];
      return width - optimalWidth;
    });

    const larger = distances.filter((d) => d >= 0);
    const smaller = distances.filter((d) => d < 0);

    const closestDistance = larger.length
      ? Math.min(...larger)
      : Math.max(...smaller);

    const closestSize = sizes.find((size) => {
      const width = size.split('x')[0];
      return width - optimalWidth === closestDistance;
    });

    return `${ENV.cdnHost}/${path}@${closestSize}.${ext}`;
  }
}
