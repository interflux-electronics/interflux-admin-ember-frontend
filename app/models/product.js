import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';

export default class ProductModel extends Model {
  @attr('string') slug;
  @attr('string') name;
  @attr('boolean') public;

  @alias('productFamily') family;

  @belongsTo('product-family') productFamily;

  @hasMany('document') documents;
  @hasMany('image') images;
}
