import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';

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

  @belongsTo('image') image;
  @alias('image') avatar;

  @hasMany('image') images;
  @hasMany('feature') features;
  @hasMany('document') documents;

  get qualities() {
    return this.features.filterBy('category', 'quality');
  }

  get processes() {
    return this.features.filterBy('category', 'process');
  }
}
