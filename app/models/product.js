import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import ENV from 'interflux/config/environment';

export default class ProductModel extends Model {
  @alias('id') slug;
  @attr('string') name;
  @attr('string') label;
  @attr('string') pitch;
  @attr('string') status;

  @belongsTo('product-family') productFamily;
  @alias('productFamily') family;

  @belongsTo('image', { inverse: 'product' }) image;

  @hasMany('image', { inverse: 'products' }) images;
  @hasMany('document') documents;
  @hasMany('quality') qualities;
  @hasMany('use') uses;

  @hasMany('product-image') productImages;
  @hasMany('product-document') productDocuments;
  @hasMany('product-quality') productQualities;
  @hasMany('product-use') productUses;

  @belongsTo('product', { inverse: 'inferiorProducts' }) superiorProduct;
  @hasMany('product', { inverse: 'superiorProduct' }) inferiorProducts;

  get url() {
    return `${ENV.wwwHost}/en/product/${this.slug}`;
  }

  get isOffline() {
    return this.status === 'offline';
  }

  get isOnline() {
    return !this.isOffline;
  }

  get isOutdated() {
    return this.status === 'outdated';
  }

  get isDiscontinued() {
    return this.status === 'discontinued';
  }
}
