import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import ENV from 'interflux/config/environment';

export default class ProductModel extends Model {
  @alias('id') slug;
  @attr('string') name;
  @attr('string') label;
  @attr('string') pitch;

  @attr('boolean') public;
  @attr('boolean') orderable;
  @attr('boolean') featured;
  @attr('boolean') popular;
  @attr('boolean') new;

  @belongsTo('product-family') productFamily;
  @alias('productFamily') family;

  @belongsTo('image', { inverse: 'product' }) image;
  @hasMany('image', { inverse: 'products' }) images;
  @hasMany('product-image') productImages;

  @hasMany('feature') features;
  @hasMany('document') documents;

  get qualities() {
    return this.features.filterBy('category', 'quality');
  }

  get processes() {
    return this.features.filterBy('category', 'process');
  }

  get url() {
    return `${ENV.wwwHost}/en/products/${this.family.get('slug')}/${this.slug}`;
  }
}
