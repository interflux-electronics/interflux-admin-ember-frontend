import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class ProductModel extends Model {
  @attr('string') name;
  @attr('string') label;
  @attr('string') lifeCyle;
  @attr('string') pitch;
  @attr('string') summary;
  @attr('string') properties;
  @attr('string') instructions;
  @attr('string') avatarPath;
  @attr('string') avatarAlt;
  @attr('string') avatarCaption;
  @attr('string') avatarVariations;
  @attr('number') rankAmongFamily;
  @attr('boolean') compliesWithROHS;
  @attr('boolean') compliesWithIEC;
  @attr('boolean') compliesWithIPCJSTD004A;
  @attr('boolean') compliesWithIPCJSTD004B;
  @attr('boolean') compliesWithIPCJSTD005;
  @attr('boolean') compliesWithISO;
  @attr('string') testResults;
  @attr('boolean') onFrontPage;
  @attr('number') frontPageRank;

  @belongsTo('product-family') productFamily;
  @belongsTo('image', { inverse: 'product' }) image;

  @hasMany('image', { inverse: 'products' }) images;
  @hasMany('document') documents;

  get family() {
    return this.productFamily;
  }

  get productUsesSorted() {
    const rank = 'rankAmongUses';
    const records = this.productUses;
    const ranked = records.filterBy(rank).sortBy(rank);
    const rankless = records.rejectBy(rank);

    return [...ranked, ...rankless];
  }

  get uses() {
    return this.productUsesSorted.map((record) => record.use);
  }

  get productQualitiesSorted() {
    const rank = 'rankAmongQualities';
    const records = this.productQualities;
    const ranked = records.filterBy(rank).sortBy(rank);
    const rankless = records.rejectBy(rank);

    return [...ranked, ...rankless];
  }

  get qualities() {
    return this.productQualitiesSorted.map((record) => record.quality);
  }

  @hasMany('product-image') productImages;
  @hasMany('product-document') productDocuments;
  @hasMany('product-quality') productQualities;
  @hasMany('product-use') productUses;

  @belongsTo('product', { inverse: 'inferiorProducts' }) superiorProduct;
  @hasMany('product', { inverse: 'superiorProduct' }) inferiorProducts;

  get url() {
    return `${ENV.publicHost}/en/product/${this.id}`;
  }

  get link() {
    return this.url.replace('https://', '').replace('http://', '');
  }

  get isOnline() {
    return !this.isOffline;
  }

  get isOffline() {
    return this.lifeCycle === 'offline';
  }

  get isOutdated() {
    return this.lifeCycle === 'outdated';
  }

  get isDiscontinued() {
    return this.lifeCycle === 'discontinued';
  }

  get isPopular() {
    return this.lifeCycle === 'popular';
  }

  get isNew() {
    return this.lifeCycle === 'new';
  }

  get avatarURL() {
    const path = this.avatarPath;
    const variations = this.avatarVariations;

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

    const optimalWidth = 400;
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
