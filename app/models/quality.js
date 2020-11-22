import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class QualityModel extends Model {
  @attr('string') slug;
  @attr('string') icon;
  @attr('string') text;
  @attr('string') gist;

  @belongsTo('image') image;

  @hasMany('product-quality') productQualities;
  @hasMany('product') products;

  get families() {
    return this.products.mapBy('family').uniqBy('id');
  }
}
