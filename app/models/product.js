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
  @hasMany('document') documents;
  @hasMany('quality') qualities;
  @hasMany('use') uses;

  @hasMany('product-image') productImages;
  @hasMany('product-document') productDocuments;
  @hasMany('product-quality') productQualities;
  @hasMany('product-use') productUses;

  get url() {
    return `${ENV.wwwHost}/en/products/${this.family.get('slug')}/${this.slug}`;
  }
}
