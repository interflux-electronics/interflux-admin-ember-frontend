import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class UseModel extends Model {
  @attr('string') slug;
  @attr('string') icon;
  @attr('string') text;
  @attr('string') gist;

  @belongsTo('image') image;

  @hasMany('product-use') productUses;
  @hasMany('product') products;

  @hasMany('use-image') useImages;

  get families() {
    return this.products.mapBy('family').uniqBy('id');
  }
}
